import {AuthUtils} from "./auth-utils";

export class CheckUser {
    constructor() {
        this.init();
    }
    init() {
        let notLogged = false;
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (userInfo === null || userInfo && (userInfo.name === null || userInfo.lastName === null || userInfo.id === null)) {
            notLogged = true;
            if (notLogged = true) {

            }
        }
    }
}