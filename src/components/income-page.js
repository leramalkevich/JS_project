import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import config from "../../config/config";
import {HttpUtils} from "../utils/http-utils";

export class IncomePage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');

        this.init();
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
        this.getIncomeCategories();
    }

    async getIncomeCategories() {
        const result = await HttpUtils.request('/categories/income')
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        console.log(result)
        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }

        this.showItems(result);

    }

    showItems(result) {
        console.log(result);
        const elements = document.getElementById('categories');
    }

}