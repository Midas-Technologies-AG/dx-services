[![Coverage Status](https://coveralls.io/repos/github/gnosis/dx-services/badge.svg?branch=master)](https://coveralls.io/github/gnosis/dx-services?branch=master)

# Dutch X Services
Dutch X Services, is a project that contains services and other goodies to make
easier the interaction with the Duch Exchange smart contracts.

# Scope and maing parts of dx-services
It contains five main elements:
* **Model**: Set of convenient wrappers and utilities to provide a simpler way
  to interact with the Dutch X. 
    * `repositories`: Provide the data access to external data sources like
      the Dutch X smart contracts, price feeds, gas price feeds, etc.
      They provide also a more intuitive error handling, that gives detailed 
      information about the reasons a smart contract revert a operation.
    * `services`: Provides some common bussiness logic operations to make
      Dutch X interactation easier.

* **REST Api**: 
  * Exposes the Dutch X data in a REST API.
  * Also documents it using swagger. Check the [API Documentation](https://dx-services.dev.gnosisdev.com/)
  * For an example on how to use the API, check [dx-examples-api](https://github.com/gnosis/dx-examples-api)

* **Cli (Command Line Interface)**:
  * Allows to interact with the Dutch X from the command line.
  * Allows to perform operations to retrieve the Dutch X state from any Ethereum
    network
  * Also, allow to fund accounts, deposit tokens into the Dutch X, participate 
    in an auction as a seller or a buyer and mutch more.
  * For an example on how to use the CLI, check [dx-examples-liquidity-bots](https://github.com/gnosis/dx-examples-liquidity-bots)

* **Liquidity Bots**
  * Allows to launch bots watching certain token pairs with the goal or ensuring
    the market liquidity.
  * The bots will automatically participate in the auctions usign the provided
    configuration.
  * For documentation about the bots, and example on how to run your own bots,
    check [dx-examples-liquidity-bots](https://github.com/gnosis/dx-examples-liquidity-bots)

* **Scheduled tasks**:
  * Allow to execute certain tasks at certain times.
  * **Used for Reporting**: Allows to send reports periodically with the 
    informarmition of the lasts auctions and the actions the bots has been taking.
  * **Used for Autoclaiming**: Allows the bots to claim their funds of past 
    auctions so they can reuse them in the upcoming ones.

For aditional information and for reference, check out the following 
repositories:

* [Gnosis Blog](https://blog.gnosis.pm/tagged/dutchx): Learn about Dutch X in 
Gnosis Blog, were you will find a series of posts about it.
* [Gitter Channel](https://gitter.im/gnosis/DutchX): Participate in the gitter channel.
* [Github: dx-examples-api](https://github.com/gnosis/dx-examples-api): 
Example project and documentation on how to use the Dutch X API.
* [Github: dx-contracts](https://github.com/gnosis/dx-contracts): Smart 
contracts of the Duch X
* [Github: dx-services](https://github.com/gnosis/dx-services): Services, 
repositories and bots to interact with DX.
* [Github: dx-react](https://github.com/gnosis/dx-react): Front end web 
application for the Dutch X seller interface


# Run it in Rinkeby
## Cli - Command Line Interface
Use the CLI:
```bash
docker run \
  -e NODE_ENV=pre \
  -e ETHEREUM_RPC_URL=https://rinkeby.infura.io \
  -e MARKETS=WETH-RDN,WETH-OMG \
  -e RDN_TOKEN_ADDRESS=0x7e2331beaec0ded82866f4a1388628322c8d5af0 \
  -e OMG_TOKEN_ADDRESS=0xc57b5b272ccfd0f9e4aa8c321ec22180cbb56054 \
  gnosispm/dx-services:staging \
  yarn cli -- \
    state WETH-RDN
```

In the previous command, notice that:
* `NODE_ENV`: Stablish the environment. Valid values are `dev`, `pre`, `pro`.
* `ETHEREUM_RPC_URL`: Ethereum node. i.e. http://localhost:8545 or https://rinkeby.infura.io
* `MARKETS`: List of token pairs in the format: `<token1>-<token2>[,<tokenN>-<tokenM>]*`, 
  i.e. `WETH-RDN,WETH-OMG`
    * For every token, you must provide also it's address using an environment 
      variable with the name: `<token>__TOKEN_ADDRESS`. i.e. `RDN_TOKEN_ADDRESS`.
    * **WETH, MGN and OWL Tokens** are part of the Dutch X Mechanism, so you don't 
      have (and shouldn't) provice an address for them.
* `gnosispm/dx-services:staging`: Is the name of the Docker image. `staging` is 
  the image generated out of the master branch. You can checkout other images 
  in [https://hub.docker.com/r/gnosispm/dx-services]()
* `yarn cli`: Is the npm script that will run the CLI
* `state WETH-RDN`:
  * Is the command executed by the CLI.
  * There's a lot of commands 
  * You can run many other commands, just run `-h` to get the complete list.
  * For more information about the CLI, check out the 
    [dx-examples-liquidity-bots](https://github.com/gnosis/dx-examples-liquidity-bots) project.


## Public API
Start API:
```bash
docker run \
  -e NODE_ENV=pre \
  -e ETHEREUM_RPC_URL=https://rinkeby.infura.io \
  -e MARKETS=WETH-RDN,WETH-OMG \
  -e RDN_TOKEN_ADDRESS=0x7e2331beaec0ded82866f4a1388628322c8d5af0 \
  -e OMG_TOKEN_ADDRESS=0xc57b5b272ccfd0f9e4aa8c321ec22180cbb56054 \
  -p 8080:8080 \
  gnosispm/dx-services:staging \
  yarn api
```

To check out the Public API, just open [http://localhost:8080]() in any Browser.

In the previous command, notice that it has a similar configuration as in the CLI
run, with the difference of:
* `-p 8080:8080`: It tells Docker to expose the container port 8080 (the API one)
  in the host machine.
* `yarn api`: NPM script used to run the Public API.

> For more information about the Public API, checkout:
>   * [API Documentation](https://dx-services.dev.gnosisdev.com/)
>   * [Example of API usage](https://github.com/gnosis/dx-examples-api)


## Liquidity Bots
Start bots:
```bash
docker run \
  -e MNEMONIC="super secret thing that nobody should know ..." \
  -e NODE_ENV=pre \
  -e ETHEREUM_RPC_URL=https://rinkeby.infura.io \
  -e MARKETS=WETH-RDN,WETH-OMG \
  -e RDN_TOKEN_ADDRESS=0x7e2331beaec0ded82866f4a1388628322c8d5af0 \
  -e OMG_TOKEN_ADDRESS=0xc57b5b272ccfd0f9e4aa8c321ec22180cbb56054 \
  -p 8081:8081 \
  gnosispm/dx-services:staging \
  yarn bots
```
To check out the Bots API, just open [http://localhost:8081]() in any Browser.

In the previous command, notice that it has a similar configuration as in the 
Public API run, with the difference of:
* `MNEMONIC`: Allows to setup the bots account used to sign the transactions.
* `-p 8081:8081`: The Bots API it's exposed on port 8081.
* `yarn bots`: NPM Script used to run the Liquidity Bots.

> For more information about the Bots, check out the [dx-examples-liquidity-bots](https://github.com/gnosis/dx-examples-liquidity-bots) project.

# Develop
## Run a local node and setup
```bash
yarn install
npm run rpc
npm run setup
```

## Public API
Start API:
```bash
npm run api
```

## Liquidity Bots
Start Bots:
```bash
npm run bots
```

## CLI - Command Line Interface
Use the bot-cli:
```bash
npm run cli
```

Some examples:
* `npm run cli -- state WETH-RDN`
* `npm run cli -- send 0.5 WETH 0x627306090abaB3A6e1400e9345bC60c78a8BEf57`
* `npm run cli -- deposit 0.5 WETH`
* `npm run cli -- deposit 150 RDN`
* `npm run cli -- sell 100 WETH-RDN`
* `npm run cli -- buy 100 RDN-WETH`


## cli2 (Deprecated)
The `cli2`, is deprectated, but it still has some methods that were not migrated
 to the new cli (they are methods used testing during development).

Use the bot-cli2:
```bash
npm run cli2
```

Some examples:
* `npm run cli2 -- --balances`
* `npm run cli2 -- --approve-token RDN`
* `npm run cli2 -- --deposit WETH,100`
* `npm run cli2 -- --time 0.5`

# License
This project is released under [MIT License](./LICENSE.md)

# Security and Liability
All the code is provided WITHOUT ANY WARRANTY; without even the implied warranty
 of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

# Feedback, suggestions, collaborations
Please, let us know any typo or error in the project or documentation. 

Any idea, proposal or colaboration will be welcome.

Also, you are encouraged to participate in the [Gitter Channel for the Dutch X](https://gitter.im/gnosis/DutchX).

# Contributors
- Stefan ([Georgi87](https://github.com/Georgi87))
- Martin ([koeppelmann](https://github.com/koeppelmann))
- Anxo ([anxolin](https://github.com/anxolin))
- Dani ([dasanra](https://github.com/dasanra))
- Dominik ([dteiml](https://github.com/dteiml))
- David ([W3stside](https://github.com/w3stside))
- Dmitry ([Velenir](https://github.com/Velenir))
- Alexander ([josojo](https://github.com/josojo))
