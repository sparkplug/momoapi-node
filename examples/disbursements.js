const momo = require("../lib");

const { Disbursements } = momo.create({ callbackHost: process.env.CALLBACK_HOST });

// initialise collections
const disbursements = Disbursements({
  userSecret: process.env.DISBURSEMENTS_USER_SECRET,
  userId: process.env.DISBURSEMENTS_USER_ID,
  primaryKey: process.env.DISBURSEMENTS_PRIMARY_KEY
});

const partyId = "256776564739";
const partyIdType = momo.PayerType.MSISDN;
// Transfer
disbursements
    .isPayerActive(partyId, partyIdType)
    .then((isActive) => {
        console.log("Is Active ? ", isActive);
        if (!isActive) {
            return Promise.reject("Party not active");
        }
        return disbursements.transfer({
            amount: "100",
            currency: "EUR",
            externalId: "947354",
            payee: {
                partyIdType,
                partyId
            },
            payerMessage: "testing",
            payeeNote: "hello",
            callbackUrl: process.env.CALLBACK_URL ? process.env.CALLBACK_URL : "https://75f59b50.ngrok.io"
        });
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
    console.log(error);
  });
