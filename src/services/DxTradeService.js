const loggerNamespace = 'dx-service:services:DxTradeService'
const Logger = require('../helpers/Logger')
const logger = new Logger(loggerNamespace)
const assert = require('assert')

const numberUtil = require('../../src/helpers/numberUtil')

class DxTradeService {
  constructor ({ auctionRepo, ethereumRepo, markets, config }) {
    this._auctionRepo = auctionRepo
    this._ethereumRepo = ethereumRepo
    this._markets = config.MARKETS
  }

  async buy ({ sellToken, buyToken, auctionIndex, from, amount }) {
    return this._auctionRepo.postBuyOrder({
      sellToken, buyToken, auctionIndex, from, amount
    })
  }

  async sell ({ sellToken, buyToken, auctionIndex, from, amount }) {
    return this._auctionRepo.postSellOrder({
      sellToken, buyToken, auctionIndex, from, amount
    })
  }

  async sendTokens ({ token, amount, fromAddress, toAddress }) {
    // const amountInWei = numberUtil.toWei(amount)
    const amountInEther = numberUtil.toBigNumber(amount).div(1e18)

    if (token === 'ETH') {
      // In case of the ETH, we make sure we have enough EtherTokens
      await this._depositEtherIfRequired({
        amount,
        accountAddress: fromAddress
      })
    }

    const transactionResult = await this._auctionRepo.transferERC20Token({
      from: fromAddress,
      to: toAddress,
      token,
      amount
    })

    logger.info({
      msg: 'Transfered %d %s from %s to %s. Transaction: %s',
      params: [ amountInEther, token, fromAddress, toAddress, transactionResult.tx ]
    })

    return transactionResult
  }

  async deposit ({ token, amount, accountAddress }) {
    const amountInEth = numberUtil.toBigNumber(amount).div(1e18)
    // Get the account we want to fund
    // const accountAddress = await this._getAccountAddress(accountIndex)
    logger.info({
      msg: 'Fund the account %s with %d %s',
      params: [ accountAddress, amount, token ]
    })

    let transactionResult
    // const amountInWei = numberUtil.toWei(amount)
    if (token === 'ETH') {
      // In case of the ETH, we make sure we have enough EtherTokens
      await this._depositEtherIfRequired({ amount, accountAddress })
    }

    // Approce DX to use the tokens
    transactionResult = await this._auctionRepo.approveERC20Token({
      from: accountAddress,
      token,
      amount
    })
    logger.info({
      msg: 'Approved the DX to use %d %s on behalf of the user. Transaction: %s',
      params: [ amountInEth, token, transactionResult.tx ]
    })

    // Deposit the tokens into the user account balance
    transactionResult = await this._auctionRepo.deposit({
      from: accountAddress,
      token,
      amount
    })
    logger.info({
      msg: 'Deposited %d %s into DX account balances for the user. Transaction: %s',
      params: [ amountInEth, token, transactionResult.tx ]
    })

    return transactionResult
  }

  async _depositEtherIfRequired ({ accountAddress, amount }) {
    let transactionResult

    // Check if the user has already enogh EtherTokens
    const etherTokenBalance = await this._auctionRepo.getBalanceERC20Token({
      token: 'ETH',
      address: accountAddress
    })
    const amountInWei = numberUtil.toBigNumber(amount)

    if (etherTokenBalance.lessThan(amount)) {
      const missingDifference = amountInWei
        .minus(etherTokenBalance)

      logger.info({
        msg: `We don't have enogth EtherTokens, so we need to deposit: %d ETH`,
        params: [ missingDifference.div(1e18) ]
      })

      transactionResult = await this._auctionRepo.depositEther({
        from: accountAddress,
        amount: missingDifference
      })
      logger.info({
        msg: 'Wrapped %d ETH in a ERC20 ETH token. Transaction: %s',
        params: [ amountInWei.div(1e18), transactionResult.tx ]
      })
    }
  }

  async _getAccountAddress (accountIndex) {
    const accounts = await this._ethereumRepo.getAccounts(accountIndex)

    assert(accounts.length >= accountIndex - 1, `There should be at least \
${accountIndex} accounts, but there's just ${accounts}`)

    return accounts[accountIndex - 1]
  }

  // TODO: Bring and refactor the `testSetup` logic that the bot-cli uses
}

module.exports = DxTradeService
