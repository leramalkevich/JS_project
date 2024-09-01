import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";

export class EditPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        if (!this.user) {
            this.openNewRoute('/login');
        }

        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');

        this.init();
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
    }

}