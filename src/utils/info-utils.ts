import {HttpUtils} from "./http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {BalanceResponseType} from "../types/balance-response.type";

export class InfoUtils {
    public static async getUserData():Promise<string|undefined|null> {
        let result:string|null = null;
        try {
            const balance:DefaultResponseType|BalanceResponseType = await HttpUtils.request('/balance');
            if (balance as BalanceResponseType) {
                result = (balance as BalanceResponseType).response.balance + ' $';
                if (result) {
                    return result;
                }
            }
            return result;
        } catch (e) {
            console.log(e);
        }
    }
}