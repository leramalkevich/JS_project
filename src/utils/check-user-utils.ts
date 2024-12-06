import {AuthUtils} from "./auth-utils";

export class CheckUser {
    constructor() {
        this.init();
    }

    private init(): void {
        const accessToken: string | null = localStorage.getItem(AuthUtils.accessTokenKey);
        if (!accessToken) {
            location.href = '/login';
        }
    }
}