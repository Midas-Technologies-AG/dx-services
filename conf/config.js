// TODO;
//  * Instead of this config being static, Initialized the config
//  * Rename the const and add the 'DEFAULT_' prefix
//  * Add environent config: mock, local, rinkeby
//      * npm run app --mock
//      * npm run app --rinkeby
//  * Override defaults with arguments and environent vars. I.e:
//      * npm run app --ethereum-rpc-url=http://localhost:9545
//      * ETHEREUM-RPC-URL=http://localhost:9545 npm run app
//  * minimum, for the 1st iteration, let override:
//      * url
//      * contract addresses
//      * botAddress and mnemonic
//      * para nota MINIMUM_SELL_VOLUME_USD
/*

example: Run in PRE
  ETHERUM_RPC_URL=<url> \
  DX_CONTRACT_ADDRESS =<add>\
  BOT_ACCOUNT_MNEMONIC=<menmonic>\
  MINIMUN_SELL_VOLUME_USD=1000\
  npm run app
*/

const ENVIRONMENT = 'DEV' // LOCAL, DEV, PRO

const MARKETS = {
  'RDN': 'ETH',
  'OMG': 'ETH'
}

const MINIMUM_SELL_VOLUME_USD = 1000

const BUY_THRESHOLDS = [{
  marketPriceRatio: 1,
  buyRatio: 1 / 3
}, {
  marketPriceRatio: 0.98,
  buyRatio: 2 / 3
}, {
  marketPriceRatio: 0.96,
  buyRatio: 1
}]

const ETHERUM_RPC_URL = 'http://127.0.0.1:8545'
const WALLET_MNEMONIC = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

const AUCTION_REPO_IMPL = 'mock' // mock, ethereum
const ETHEREUM_REPO_IMPL = 'impl' // mock. impl

// contracts
const CONTRACTS_BASE_DIR = 'build/contracts'
const CONTRACTS_DUTCH_EXCHANGE_DIR = 'node_modules/@gnosis.pm/dutch-exchange/build/contracts'
const CONTRACT_DEFINITIONS = {
  StandardToken: CONTRACTS_DUTCH_EXCHANGE_DIR + '/StandardToken',
  DutchExchange: CONTRACTS_DUTCH_EXCHANGE_DIR + '/DutchExchange',
  PriceOracleInterface: CONTRACTS_DUTCH_EXCHANGE_DIR + '/PriceOracleInterface',
  DutchExchangeProxy: CONTRACTS_DUTCH_EXCHANGE_DIR + '/Proxy',
  EtherToken: CONTRACTS_DUTCH_EXCHANGE_DIR + '/EtherToken',
  TokenTUL: CONTRACTS_DUTCH_EXCHANGE_DIR + '/TokenTUL',
  TokenOWL: CONTRACTS_DUTCH_EXCHANGE_DIR + '/TokenOWL'
}

const DX_CONTRACT_ADDRESS = null // TODO: Override with ENV_VAR
// TODO: Implement the aditional token config
const ERC20_TOKEN_ADDRESSES = {
  RDN: null,
  OMG: null
}

/*
ETHERUM_RPC_URL
DX_CONTRACT_ADDRESS
BOT_ACCOUNT_MNEMONIC
MINIMUN_SELL_VOLUME_USD
*/

// Kraken custom config
const KRAKEN = {
  url: 'https://api.kraken.com',
  version: '0'
}

/*
TODO: Define the minimun config required to trade

const BUY_TOKENS_KEYS =
const CONTRACT_XXXXX_ADDRESS =
const CONTRACT_YYYYY_ADDRESS =
*/

const API_PORT = 8080
const API_HOST = '0.0.0.0'

module.exports = {
  ENVIRONMENT,

  // bot config
  MARKETS,
  MINIMUM_SELL_VOLUME_USD,
  BUY_THRESHOLDS,

  // Ethereum config
  ETHERUM_RPC_URL,
  WALLET_MNEMONIC,

  // REPO
  AUCTION_REPO_IMPL,
  ETHEREUM_REPO_IMPL,

  // CONTRACTS
  CONTRACT_DEFINITIONS,
  DX_CONTRACT_ADDRESS,
  ERC20_TOKEN_ADDRESSES,
  CONTRACTS_BASE_DIR, // Just used for development

  // API
  API_PORT,
  API_HOST,

  // Exchanges
  KRAKEN
}
