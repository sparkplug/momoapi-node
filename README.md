## MoMoApi-Node
MTN MoMo API Client for Node JS. 

# Installation
` npm install `

#  Development 
` npm run start:dev `


#  Usage 

The currently available methods

## requestToPay

This method sends out a requestToPay to a client

```node
collectionTransaction.requestToPay(subscription-key,host,enviroment, {
    amount: string,
    currency: string,
    externalId: string,
    payer: {
        
        partyId: string
    },
    payerMessage: string,
    payeeNote: string
})
```

## getBalance

```node
collectionTransaction.getBalance(subscription-key,enviroment)
```

This method returns the balance