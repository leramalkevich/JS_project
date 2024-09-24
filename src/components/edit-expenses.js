import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";

export class EditExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        const title = urlParams.get('title');
        if (!id || !title) {
            return this.openNewRoute('/');
        }
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');

        this.init();
        this.changeCategoryTitle(id, title);
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
    }

    changeCategoryTitle(id, title) {
        const that = this;
        let input = document.getElementById('chosen-category');
        input.value = title;
        let newTitle = input.value;
        document.getElementById('back-button').addEventListener('click', function () {
            return that.openNewRoute('/expenses');
        })
        input.addEventListener('input', function (e) {
            newTitle = input.value;
            const params = {
                id: id,
                title: newTitle,
            }

            document.getElementById('save-changes').addEventListener('click', async function () {
                const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, params);
                if (!result || result.error || (!result.error && !result.response)) {
                    return alert('Возникла ошибка. Обратитесь в поддержку.');
                }
                if (result && !result.error && result.response) {
                    return that.openNewRoute('/expenses');
                }
                console.log(result);
            })
        });

    }
}