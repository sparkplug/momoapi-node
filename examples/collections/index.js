const momo = require("mtn-momo");
const express = require("express");

const app = express();
const port = 3000;

const { Collections } = momo({
  callbackHost: "example.com"
})

// initialise collections
const collections = Collections({
  userSecret: process.env.USER_SECRET,
  userId: process.env.USER_ID,
  primaryKey: process.env.PRIMARY_KEY
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/account", (_req, res) => {
  return collections.getBalance().then(balance => res.json(balance));
});

app.get("/transaction/:id", (req, res) => {
  return collections.getTransaction(req.body.id).then(balance => res.json(balance));
});

app.post("/pay", (req, res) => {
  return collections
    .requestToPay({
      amount: req.body.amount,
      currency: "EUR",
      externalId: Date.now(),
      payer: {
        partyIdType: "MSISDN",
        partyId: req.body.phoneNumber
      },
      payerMessage: "testing",
      payeeNote: "hello"
    })
    .then(referenceId => collections.getTransaction(referenceId))
    .then(transaction => res.json(transaction));
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening on port ${port}`);
});

const { Collections } = momo({ callbackHost: process.env.CALLBACK_HOST });

// Request to pay
collections
  .isPayerActive()
  .then(() => {
    return collections.requestToPay({
      amount: "50",
      currency: "EUR",
      externalId: "123456",
      payer: {
        partyIdType: "MSISDN",
        partyId: "+256774290781"
      },
      payerMessage: "testing",
      payeeNote: "hello",
      callbackUrl: "https://example.com/mtn/collections"
    });
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
