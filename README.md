# MTN MoMo API Client

MTN MoMo API Client for Node JS.

## Development

Clone this repository and compile

```sh
git clone git@github.com:sparkplug/momoapi-node.git
cd momoapi-node
npm install
npm run compile
npm link # to test and develop cli tooling in development
```

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

### Collections

The collections client can be created with the following paramaters;
- `baseUrl`: An optional base url to the MTN Momo API. By default the staging base url will be used
- `environment`: Optional enviroment, either "sandbox" or "production". Sandbox by default
- `host`: The domain where you webhooks urls are hosted;
- `subscriptionKey`: Find this on the MTN Momo API dashboard
- `userId`: For production, find your Collections User ID on MTN Momo API dashboard. For sandbox, use the one generated with the `momo-sandbox` command for sandbox
- `userSecret`: For production, find your Collections User Secret on MTN Momo API dashboard. For sandbox, use the one generated with the `momo-sandbox` command for sandbox

**Sample Code**

```js
const momo = require("mtn-momo");

// initialise the collections api
const collections = new momo.Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  subscriptionKey: process.env.SUBSCRIPTION_KEY,
  environment: process.env.ENVIRONMENT,
  host
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
    return collections.getTransactionStatus(transactionId);
  })
  .then(transactionStatus => {
    console.log({ transactionStatus });

    // Get account balance
    return collections.getAccountBalance();
  })
  .then(accountBalance => console.log({ accountBalance }))
  .catch(error => {
    if (error.response && error.response.data) {
      console.log(error.response.data);
    }

    console.log(error.message);
  });
```
