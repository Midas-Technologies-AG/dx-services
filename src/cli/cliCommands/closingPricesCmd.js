const formatUtil = require('../../helpers/formatUtil')
const cliUtils = require('../helpers/cliUtils')

function registerCommand ({ cli, instances, logger }) {
  cli.command('closing-prices <token-pair> [count]', 'Get the closing prices for a given pair (i.e. WETH-RDN)', yargs => {
    cliUtils.addPositionalByName('token-pair', yargs)
    cliUtils.addPositionalByName('count', yargs)
  }, async function (argv) {
    const { tokenPair: tokenPairString, count } = argv
    const [ sellToken, buyToken ] = tokenPairString.split('-')
    const {
      dxInfoService
    } = instances

    // Get data
    const lastClosingPrices = await dxInfoService.getLastClosingPrices({
      sellToken,
      buyToken,
      count
    })

    logger.info('Showing last %d closing prices:', count)
    lastClosingPrices.forEach(({ auctionIndex, price, percentage }, i) => {
      let percentageMessage
      if (percentage) {
        if (percentage.greaterThan(0)) {
          const value = percentage.toFixed(2)
          percentageMessage = `(+${value})`
        } else {
          const value = percentage.toFixed(2)
          percentageMessage = `(${value})`
        }
      } else {
        percentageMessage = ''
      }

      logger.info(
        '\t%d. %s%s',
        auctionIndex,
        price ? formatUtil.formatFraction(price) : 'No closed yet',
        percentageMessage
      )
    })
  })
}

module.exports = registerCommand