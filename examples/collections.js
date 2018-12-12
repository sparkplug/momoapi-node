const momo = require("../lib/");

// initialise the library
const collections = new momo.Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  subscriptionKey: process.env.SUBSCRIPTION_KEY,
  environment: process.env.ENVIRONMENT
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
