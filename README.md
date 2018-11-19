## MoMoApi-Node
MTN MoMo API Client for Node JS. 

# Installation
` npm install `

#  Development 
` npm run start:dev `


#  Usage 
There are two methods which are related to the collections product in [this](https://github.com/Kaminto/momoapi-node/blob/master/src/main.ts) file.


-[**requestToPay**](https://github.com/Kaminto/momoapi-node/blob/master/src/main.ts#L12)

`collectionTransaction.requestToPay(subscription-key,host,enviroment, {
    amount: string,
    currency: string,
    externalId: string,
    payer: {
        
        partyId: string
    },
    payerMessage: string,
    payeeNote: string
})`



-[**getBalance**](https://github.com/Kaminto/momoapi-node/blob/master/src/main.ts#L27)


`collectionTransaction.getBalance(subscription-key,enviroment)`

-This method returns the balance