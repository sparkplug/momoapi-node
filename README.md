# MTN MoMo API Client

MTN MoMo API Client for Node JS.

[![Build Status](https://travis-ci.com/sparkplug/momoapi-node.svg?branch=master)](https://travis-ci.com/sparkplug/momoapi-node)
[![NPM Version](https://badge.fury.io/js/mtn-momo.svg)](https://badge.fury.io/js/mtn-momo)
![Installs](https://img.shields.io/npm/dt/mtn-momo.svg)

## Usage

### Installation

Add the library to your project

```sh
npm install mtn-momo
```

## Sandbox Credentials

To get sandbox credentials; install the package globally and run the `momo-sandbox` command or install the package locally to your project and run `momo-sandbox` with the `npx` command.

```sh
## Within a project
npm install --save momoapi-node
npx momo-sandbox --host example.com --primary-key 23e2r2er2342blahblah

## Globally
npm install --global momoapi-node
momo-sandbox --host example.com --primary-key 23e2r2er2342blahblah
```

If all goes well, it will print something like this in your terminal;

```sh
Momo Sandbox Credentials {
  "userSecret": "your api key",
  "userId": "your user id"
}
```

You can use those values when developing against the sandbox. When ready to go live, you will be provided with the values to use in production

## Configuration

Before you can use collections, you need to create an instance of the client. This library exports a function that returns the client given global configuration;

```js
const momo = require("mtn-momo");

const { Collections } = momo({ callbackHost: process.env.CALLBACK_HOST });
```

The global configuration consists of the following;

- `baseUrl`: An optional base url to the MTN Momo API. By default the sandbox base url will be used
- `environment`: Optional enviroment, either "sandbox" or "production". Sandbox is used by default
- `callbackHost`: The domain where you webhooks urls are hosted;


## Collections

The collections client can be created with the following paramaters;

- `primaryKey`: Find this on the MTN Momo API dashboard
- `userId`: For production, find your Collections User ID on MTN Momo API dashboard. For sandbox, use the one generated with the `momo-sandbox` command for sandbox
- `userSecret`: For production, find your Collections User Secret on MTN Momo API dashboard. For sandbox, use the one generated with the `momo-sandbox` command for sandbox

You can create a collections client with the following;

```js
const collections = Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  primaryKey: process.env.PRIMARY_KEY
});
```

### Methods

1. `requestToPay(request: PaymentRequest): Promise<string>`

This method inititates a payment. The user can then authorise to it with their PIN. It returns a promise that resolves the transaction id. You can use the transaction id to check the transaction status, check the nmethod below.

2. `getTransactionStatus(transactionId: string): Promise<Transaction>`

3. `getAccountBalance(): Promise<AccountBalance>`

### Sample Code

```js
const momo = require("mtn-momo");

const { Collections } = momo({ callbackHost: process.env.CALLBACK_HOST });

const collections = Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  primaryKey: process.env.PRIMARY_KEY
});

// Request to pay
collections
  .requestToPay({
    amount: "50",
    currency: "EUR",
    externalId: "123456",
    payer: {
      partyIdType: "MSISDN",
      partyId: "256774290781"
    },
    payerMessage: "testing",
    payeeNote: "hello"
  })
  .then(transactionId => {
    console.log({ transactionId });

    // Get transaction status
    return collections.getTransaction(transactionId);
  })
  .then(transaction => {
    console.log({ transaction });

    // Get account balance
    return collections.getBalance();
  })
  .then(accountBalance => console.log({ accountBalance }))
  .catch(error => {
    if (error.response) {
      return console.log(error.response.data, error.response.config);
    }

    return console.log(error.message);
  });
```

## Development

Clone this repository and compile

```sh
git clone git@github.com:sparkplug/momoapi-node.git
cd momoapi-node
npm install
npm run compile
npm link # to test and develop the cli tool locally
```
