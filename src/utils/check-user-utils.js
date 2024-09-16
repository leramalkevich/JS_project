import {AuthUtils} from "./auth-utils";

export class CheckUser {
    constructor() {
        this.init();
    }
    init() {
        const accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        if (!accessToken) {
            location.href = '/login';
        }
    }
}