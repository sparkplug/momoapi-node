import * as http from 'http';
import * as https from 'https';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Collections, token } from './collections'

const momolink = "https://ericssonbasicapi2.azure-api.net/colection/v1_0";
let collection = new Collections();
export class CollectionTransaction {


    async requestToPay(subscriptionKey: string, hostName: string, enviroment: string, client:{
        amount: string,
        currency:string,
        externalId: string,
        payer: {
           partyId: string
        },
        payerMessage: string,
        payeeNote: string
    }) {
        const data = await collection.getAccessToken("f8a4c36cf52e4644a87ec946160ea02f", "https://akabbo.ug");
       
        try {
            const response: AxiosResponse = await Axios.post(momolink+'/requesttopay',
                {
                    "amount": client.amount,
                    "currency": client.currency,
                    "externalId": client.externalId,
                    "payer": {
                        "partyIdType": "MSISDN",
                        "partyId": client.payer.partyId
                    },
                    "payerMessage": client.payerMessage,
                    "payeeNote": client.payeeNote
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey,
                        "X-Reference-Id": token,
                        "X-Target-Environment": enviroment,
                        "Authorization": "Bearer " + data.access_token
                    }
                });

            
           return this.requestToPayStatus(subscriptionKey, data.access_token, enviroment)


        } catch (error) {

            return error.response
        }
    }
  


    async requestToPayStatus(subscriptionKey: string, access_token: string, enviroment: string) {
         
        try {

            const response: AxiosResponse = await Axios.get(momolink + '/requesttopay/' + token,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey,
                        "X-Target-Environment": enviroment,
                        "Authorization": "Bearer " + access_token
                    }
                });

            return response.data;
        } catch (error) {

            return error.response.data
        }
    }


    async getBalance(subscriptionKey: string, enviroment: string) {
        const data = await collection.getAccessToken("f8a4c36cf52e4644a87ec946160ea02f", "https://akabbo.ug");
       
        try {

            const response: AxiosResponse = await Axios.get(momolink + '/account/balance',
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey,
                        "X-Target-Environment": enviroment,
                        "Authorization": "Bearer " + data.access_token
                    }
                });    

            return response.data;
        } catch (error) {

            return error.response.data
        }
    }
  
}