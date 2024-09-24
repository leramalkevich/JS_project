import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";

export class CreateExpenses {
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
        this.createExpensesCategory();
    }
    createExpensesCategory() {
        const that = this;
        const newCategoryTitle = document.getElementById('new-category-title');
        const actionButton = document.getElementById('create-btn');
        const backButton = document.getElementById('back-btn');
        actionButton.addEventListener('click', async function () {
            if (newCategoryTitle.value && newCategoryTitle.value.match(/^[А-Я][а-я]+\s*[а-я]*\s*$/)) {
                const newTitle = {
                    title: newCategoryTitle.value
                }
                const result = await HttpUtils.request('/categories/expense', 'POST', true, newTitle);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }
                if (result.response && result.response.error && result.response.message === 'This record already exists') {
                    return alert('Такая категория уже существует.');
                } else if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку.');
                }

                return that.openNewRoute('/expenses');
            }
        });
        backButton.addEventListener('click', function () {
            that.openNewRoute('/expenses');
        })
    }
}