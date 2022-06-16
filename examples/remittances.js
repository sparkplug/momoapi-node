const momo = require("../lib");

const { Remittances } = momo.create({ callbackHost: process.env.CALLBACK_HOST });

// initialise collections
const remittances = Remittances({
  userSecret: process.env.REMITTANCES_USER_SECRET,
  userId: process.env.REMITTANCES_USER_ID,
  primaryKey: process.env.REMITTANCES_PRIMARY_KEY
});

const partyId = "256776564739";
const partyIdType = momo.PayerType.MSISDN;
// Transfer
remittances
    .isPayerActive(partyId, partyIdType)
    .then((isActive) => {
        console.log("Is Active ? ", isActive);
        if (!isActive) {
            return Promise.reject( new Error("Party not active"));
        }
        return remittances.remit({
            amount: "100",
            currency: "EUR",
            externalId: "947354",
            payee: {
                partyIdType,
                partyId
            },
            payerMessage: "testing",
            payeeNote: "hello",
            callbackUrl: process.env.CALLBACK_URL
        });
    })
    
  .then(transactionId => {
    console.log({ transactionId });

    // Get transaction status
    return remittances.getTransaction(transactionId);
  })
  .then(transaction => {
    console.log({ transaction });

    // Get account balance
    return remittances.getBalance();
  })
  .then(accountBalance => console.log({ accountBalance }))
  .catch(error => {
    console.log(error);
  });
