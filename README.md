# Tezos Wallet


Client side library written in [Typescript](https://www.typescriptlang.org/) for building application utilizing [Tezos](http://tezos.com/) crypto currency and [Trezor](https://trezor.io/) hardware wallet.

Tezos wallet simplifies communication with Tezos nodes and significantly reduces burden of working with Tezos network.

## Installation

Add NPM package to the list of dependencies

``npm install tezos-wallet``

Project is based on [RxJS](https://rxjs-dev.firebaseapp.com/) and relies on it as peer dependency, therefore add supported version as dependency of you project.

``npm install rxjs@~6.3.2``

In your webopack config add:
```
node: {
    crypto: true, 
    stream: true 
}
```

## Development

Import the libary methods as
``import { initializeWallet, getWallet } from 'tezos-wallet';``

Library is tested with Typescript versions 2.9.2 and latest 3.2.2.

## Code

Code is well described and documentation generated using [Typedoc](http://typedoc.org/) can be viewed in [docs](/docs/README.md) folder.

## Examples

Code samples describing usage can be found in [example](/examples/index.md) folder.