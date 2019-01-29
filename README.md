# MTN MoMo API Client

MTN MoMo API Client for Node JS.

[![Build Status](https://travis-ci.com/sparkplug/momoapi-node.svg?branch=master)](https://travis-ci.com/sparkplug/momoapi-node)

## Usage

### Installation

Add the library to your project

```sh
npm install mtn-momo --save-dev
```

## Sandbox Credentials

Next, we need to get the `User ID` and `User Secret` and to do this we shall need to use the `Primary Key` for the `Product` to which we are subscribed, as well as specify a `host`. We run the `momo-sandbox` as below.

```sh
## Within a project
npx momo-sandbox --host example.com --primary-key 23e2r2er2342blahblah
```

If all goes well, it will print the credentials on the terminal;

```sh
Momo Sandbox Credentials {
  "userSecret": "b2e23bf4e3984a16a55dbfc2d45f66b0",
  "userId": "8ecc7cf3-0db8-4013-9c7b-da4894460041"
}
```

These are the credentials we shall use for the `sandbox` environment. In production, these credentials are provided for you on the MTN OVA management dashboard after KYC requirements are met.

## Configuration

Before we can fully utilize the library, we need to specify global configurations. The global configuration must contain the following:

- `baseUrl`: An optional base url to the MTN Momo API. By default the staging base url will be used
- `environment`: Optional enviroment, either "sandbox" or "production". Default is 'sandbox'
- `callbackHost`: The domain where you webhooks urls are hosted. This is mandatory.

As an example, you might configure the library like this:

```js
const momo = require("mtn-momo");

const { Collections } = momo({ callbackHost: process.env.CALLBACK_HOST });
```

Currently, the library only supports `Collections`. Let us create a client with the previously generated credentials for the `Collections` product.

## Collections

The collections client can be created with the following paramaters. Note that the `userID` and `userSecret` for production are provided on the MTN OVA dashboard;

- `primaryKey`: Primary Key for the `Collections` product.
- `userId`: For sandbox, use the one generated with the `momo-sandbox` command.
- `userSecret`: For sandbox, use the one generated with the `momo-sandbox` command.

You can create a collections client with the following

```js
const collections = Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  primaryKey: process.env.PRIMARY_KEY
});
```

#### Methods

1. `requestToPay(request: PaymentRequest): Promise<string>`

This operation is used to request a payment from a consumer (Payer). The payer will be asked to authorize the payment. The transaction is executed once the payer has authorized the payment. The transaction will be in status PENDING until it is authorized or declined by the payer or it is timed out by the system. Status of the transaction can be validated by using `getTransaction`

2. `getTransaction(transactionId: string): Promise<Transaction>`

This method is used to get the Transaction object.

3. `getBalance(): Promise<AccountBalance>`

Get the balance of the account.

4. `isPayerActive(id: string, type: PartyIdType = "MSISDN"): Promise<any>`

This method is used to check if an account holder is registered and active in the system.

#### Sample Code

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


