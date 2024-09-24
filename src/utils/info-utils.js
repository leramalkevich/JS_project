import {HttpUtils} from "./http-utils";

export class InfoUtils {
    static async getUserData() {
        let result = null;
        try {
            const balance = await HttpUtils.request('/balance');
            // console.log(balance);
            if (balance) {
                result = balance.response.balance + ' $';
            }
            return result;
        } catch (e) {
            console.log(e);
        }
    }
}