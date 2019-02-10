const momo = require("../lib");

const { Disbursements } = momo({ callbackHost: process.env.CALLBACK_HOST });

// initialise collections
const disbursements = Disbursements({
  userSecret: process.env.DISBURSEMENTS_USER_SECRET,
  userId: process.env.DISBURSEMENTS_USER_ID,
  primaryKey: process.env.DISBURSEMENTS_PRIMARY_KEY
});

// Transfer
disbursements
  .transfer({
    amount: "100",
    currency: "EUR",
    externalId: "947354",
    payee: {
      partyIdType: "MSISDN",
      partyId: "+256776564739"
    },
    payerMessage: "testing",
    payeeNote: "hello",
    callbackUrl: "https://75f59b50.ngrok.io"
  })
  .then(transactionId => {
    console.log({ transactionId });

    // Get transaction status
    return disbursements.getTransaction(transactionId);
  })
  .then(transaction => {
    console.log({ transaction });

    // Get account balance
    return disbursements.getBalance();
  })
  .then(accountBalance => console.log({ accountBalance }))
  .catch(error => {
    if (error.response) {
      console.log(error.response.data, error.response.config);
    }

    console.log(error.message);
  });
