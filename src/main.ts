import * as http from 'http';
import * as https from 'https';
import * as uuid from 'uuid/v4';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Collections } from './collections'
import { CollectionTransaction } from './transactions'

let collection = new Collections();
let collectionTransaction = new CollectionTransaction();

            
collectionTransaction.requestToPay("f8a4c36cf52e4644a87ec946160ea02f","https://googe.com","sandbox", {
    "amount": "2000",
    "currency": "EUR",
    "externalId": "string",
    "payer": {
        
        "partyId": "256778702721"
    },
    "payerMessage": "string",
    "payeeNote": "string"
}).then(function (response) {
    console.log(response)
       
})    

collectionTransaction.getBalance("f8a4c36cf52e4644a87ec946160ea02f","sandbox").then(function (response) {
    console.log(response)
       
})   
 
