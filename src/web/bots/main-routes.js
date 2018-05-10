// const debug = require('debug')('DEBUG-dx-services:web:api')

function createRoutes ({ botsService }) {
  const routes = []

  routes.push({
    path: [ '/', '/version' ],
    get (req, res) {
      return botsService.getVersion()
    }
  })

  routes.push({
    path: '/v1/ping',
    get (req, res) {
      res.status(204).send()
    }
  })

  routes.push({
    path: '/v1/health',
    get (req, res) {
      return botsService.getHealthEthereum()
    }
  })

  routes.push({
    path: '/about',
    get (req, res) {
      return botsService.getAbout()
    }
  })

  return routes
}

module.exports = createRoutes
