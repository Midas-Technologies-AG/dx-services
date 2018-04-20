const loggerNamespace = 'dx-service:helpers:ContractLoader'
const Logger = require('../helpers/Logger')
const logger = new Logger(loggerNamespace)

const environment = process.env.NODE_ENV
const isLocal = environment === 'local'
const assert = require('assert')

class ContractLoader {
  constructor ({
    ethereumClient,
    config
  }) {
    this._ethereumClient = ethereumClient
    this._contractDefinitions = config.CONTRACT_DEFINITIONS
    this._dxContractAddress = config.DX_CONTRACT_ADDRESS
    this._gnoTokenAddress = config.GNO_TOKEN_ADDRESS
    this._erc20TokenAddresses = config.ERC20_TOKEN_ADDRESSES
    this._devContractsBaseDir = config.CONTRACTS_BASE_DIR
  }
  async loadContracts () {
    const [ dx, erc20TokenContracts ] = await Promise.all([
      this._loadDx(),
      this._loadTokenContracts()
    ])

    const dxContracts = await this._loadDxContracts(dx)

    return { dx, ...dxContracts, erc20TokenContracts }
  }

  async _loadDx () {
    const dxContract = this._ethereumClient
      .loadContract(this._contractDefinitions.DutchExchange)

    let dxContractAddress
    if (this._dxContractAddress) {
      // If the DX address is provided
      dxContractAddress = this._dxContractAddress
      this._dxMaster = null
    } else {
      // We load the DX address from the contract
      const proxyContract = this._ethereumClient
        .loadContract(this._contractDefinitions.DutchExchangeProxy)

      dxContractAddress = await this._getDeployedAddress('DX Proxy', proxyContract, false)
      this._dxMaster = await this._getDeployedAddress('DX', dxContract, false)
    }
    const dxContractInstance = dxContract.at(dxContractAddress)

    // no public :(
    // this._dxMaster = dxContractInstance.masterCopy

    return dxContractInstance
  }

  async _loadERC20tokenContract (token, tokenContract) {
    let address = this._erc20TokenAddresses[token]
    if (!address) {
      if (isLocal) {
        const contract = await this._ethereumClient
          .loadContract(`${this._devContractsBaseDir}/Token${token}`)

        address = await this._getDeployedAddress('Token ' + token, contract)
      } else {
        throw new Error(`The Token address for ${token} is mandatory for the environment ${environment}`)
      }
    }
    return {
      token,
      contract: tokenContract.at(address)
    }
  }

  async _loadGnoContract () {
    const gnoTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenGNO)

    let address = this._gnoTokenAddress
    if (!address) {
      address = await this._getDeployedAddress('Token GNO', gnoTokenContract, false)
    }

    return gnoTokenContract.at(address)
  }

  async _loadTokenContracts () {
    const standardTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.StandardToken)

    logger.debug('this._erc20TokenAddresses: %s', this._erc20TokenAddresses)

    const tokenContractList = await Promise.all(
      Object
        .keys(this._erc20TokenAddresses)
        .map(token => {
          return this._loadERC20tokenContract(token, standardTokenContract)
        })
    )

    return tokenContractList.reduce((tokenContractsAux, contractInfo) => {
      tokenContractsAux[contractInfo.token] = contractInfo.contract
      return tokenContractsAux
    }, {})
  }

  async _loadDxContracts (dx) {
    const etherTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.EtherToken)

    const mgnTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenMGN)

    /* TODO: Get GNO from OWL address? ? */
    const owlTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenOWL)

    /*
    const gnoTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenGNO)
    */

    const priceOracleContract = this._ethereumClient
      .loadContract(this._contractDefinitions.PriceOracleInterface)

    const [ priceOracle, eth, mgn, owl, gno ] = await Promise.all([
      // load addresses from DX
      dx.ethUSDOracle.call(),
      dx.ethToken.call(),
      dx.frtToken.call(),
      dx.owlToken.call() // TODO: Is this the PROXY??
    ])
      // load instances of the contract
      .then(([ priceOracleAddress, ethAddress, mgnAddress, owlAddress ]) => (
        Promise.all([
          priceOracleContract.at(priceOracleAddress),
          etherTokenContract.at(ethAddress),
          mgnTokenContract.at(mgnAddress),
          owlTokenContract.at(owlAddress),
          this._loadGnoContract()
        ]))
      )
    return {
      priceOracle,
      eth,
      mgn,
      owl,
      gno
    }
  }

  async _getDeployedAddress (contractName, contract, enforceLocalOnly = true) {
    if (enforceLocalOnly) {
      assert(isLocal, `Getting the deployed address from the truffle contract \
is only avaliable in LOCAL. Environment = ${environment}`)
    }

    return contract
      .deployed()
      .then(contractInstance => contractInstance.address)
      .catch(error => {
        logger.error({
          msg: 'Error loading the contract address from "%s": %s',
          params: [ contractName, error.toString() ],
          error
        })

        // Rethrow error after logging
        throw error
      })
  }
}
module.exports = ContractLoader
