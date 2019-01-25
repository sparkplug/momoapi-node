const momo = require("../lib/");

const { Collections } = momo({ callbackHost: process.env.CALLBACK_HOST });

// initialise collections
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
      console.log(error.response.data, error.response.config);
    }

    console.log(error.message);
  });
