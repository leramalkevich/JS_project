import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";

export class ExpensesPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');

        this.init();
        this.getExpensesCategories().then();
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
    }

    async getExpensesCategories() {
        const result = await HttpUtils.request('/categories/expense');
        console.log(result);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }

        this.showItems(result);
    }

    showItems(result) {
        const elements = document.getElementById('categories');
        for (let i = 0; i < result.response.length; i++) {
            const colElement = document.createElement('div');
            colElement.className = 'col' + ' mb-3';

            const cardElement = document.createElement('div');
            cardElement.className = 'card' + ' p-3';
            const cardTitleElement = document.createElement('div');
            cardTitleElement.className = 'card-title' + ' fs-4' + ' mb-2' + ' fw-bolder' + ' text-body';
            cardTitleElement.innerText = result.response[i].title;
            const cardActionElement = document.createElement('div');
            cardActionElement.className = 'card-action';
            cardActionElement.innerHTML = '<a href="/edit-expenses?id=' + result.response[i].id + '&title=' + result.response[i].title + '" class="btn btn-primary me-2 mb-2" type="button">Редактировать</a>' +
                '<button class="btn btn-danger mb-2 delete" id="' + result.response[i].id + '" type="button" data-bs-toggle="modal" data-bs-target="#modalSheet">Удалить</button>';
            cardElement.appendChild(cardTitleElement);
            cardElement.appendChild(cardActionElement);

            colElement.appendChild(cardElement);

            elements.appendChild(colElement);
        }

        const addElement = document.getElementById('add-button');
        elements.appendChild(addElement);

        this.clickDeleteButton();
    }
    clickDeleteButton() {
        const deleteButton = document.getElementsByClassName('delete');
        const that = this;
        let id = null;
        for (let i = 0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener('click', function () {
                id = deleteButton[i].id;
                that.deleteIncomeCategory(id);
            })
        }
    }

    deleteIncomeCategory(id) {
        const deleteBtn = document.getElementById('delete-btn');
        deleteBtn.addEventListener('click', async function () {
            const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
            if (!result || result.error || (!result.error && !result.response)) {
                return alert('Возникла ошибка. Обратитесь в поддержку.');
            }
            if (result && !result.error) {
                const btn = document.getElementById(id);
                let deleteActionBlock = btn.parentNode;
                let deleteBlock = deleteActionBlock.parentNode;
                let deleteColBlock = deleteBlock.parentNode;
                deleteColBlock.remove();
            }
        })
    }
}