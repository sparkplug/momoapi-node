import * as http from 'http';
import * as https from 'https';
import * as uuid from 'uuid/v4';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const momolink = "https://ericssonbasicapi2.azure-api.net/v1_0/apiuser";
const tokenlink = "https://ericssonbasicapi2.azure-api.net/colection/token/";
export const token = uuid();
export class Collections {

 
    async  generateApiUser(subscriptionKey,hostName) {
        try {
            const data: AxiosResponse = await Axios.post(momolink,
                { "providerCallbackHost": hostName },
                {
                    headers: {
                        'X-Reference-Id': token,
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey
                    }
                });

        } catch (error) {
            console.log(error.response.data);
            return error.response.data
        }
    };



    async getAccessToken(subscriptionKey:string,hostName:string) {

        this.generateApiUser(subscriptionKey,hostName);
        try {
            const response: AxiosResponse = await Axios.post(momolink + '/' + token + '/apikey',
                { "": "" },
                { 
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey
                    }
                });

            var base64 = new Buffer(token + ':' + response.data.apiKey).toString('base64');

            // return {
            //     base64: base64,
            //     apiUserKey: { 'UserId': token, 'APISecret': response.data.apiKey }
            // } 
            return this.generateAccessToken(base64,subscriptionKey);
        } catch (error) {

            return error.response.data
        }
    }


    async generateAccessToken(base64: string,subscriptionKey:string) {

        try {
            const response: AxiosResponse = await Axios({
                method: 'post',
                url: 'https://ericssonbasicapi2.azure-api.net/colection/token',
                data: {},
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": subscriptionKey,
                    "Authorization": "Basic " + base64
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            });

            return response.data;


        } catch (error) {

            return error.response.data

        }
    }


    async getApiUserInfo(subscriptionKey:string) {
        try {
            const response: AxiosResponse = await Axios.get(momolink + '/' + token,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey
                    }
                })

            console.log(response);

        } catch (error) {

            return error.response.data
        }
    }






}