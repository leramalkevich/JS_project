import config from "../../config/config";
import {AuthUtils} from "./auth-utils";

export class InfoUtils {
    static async getUserData() {
        let result = null;
        try {
            const balance = await fetch(config.api + '/balance', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': AuthUtils.getAuthInfo(AuthUtils.accessTokenKey),
                }
            })

            if (balance) {
                const receivedBalance = await balance.json();
                result = receivedBalance.balance + ' $';
                if (balance.status < 200 || balance.status >= 300) {
                    if (balance.status === 401) {
                        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
                            balance.redirect = '/login';
                        } else {
                            const updateTokenResult = await AuthUtils.updateRefreshToken();
                            if (updateTokenResult) {
                                const updateBalance = await fetch(config.api + '/balance', {
                                    method: 'GET',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Accept': 'application/json',
                                        'x-auth-token': AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
                                    }
                                })
                                if (updateBalance) {
                                    const backUpdatedBalance = await updateBalance.json();
                                    result = backUpdatedBalance.balance + ' $';
                                }
                            } else {
                                balance.redirect = '/login';
                            }
                        }
                    }
                }
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}