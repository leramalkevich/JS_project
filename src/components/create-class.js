import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";

export class CreateClass {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);

        const type = urlParams.get('type');
        if (!type) {
            return this.openNewRoute('/');
        }
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');
        this.titlePartElement = document.getElementById('title-part');
        this.typeDataElement = document.getElementById('type-input');
        this.categoryDataElement = document.getElementById('categoryOptions');
        this.categoryDataErrorElement = document.getElementById('categoryOptions-error');
        this.amountDataElement = document.getElementById('amount-input');
        this.amountDataErrorElement = document.getElementById('amount-input-error');
        this.dateDataElement = document.getElementById('date-input');
        this.dateDataErrorElement = document.getElementById('date-input-error');
        this.commentDataElement = document.getElementById('comment-input');
        this.commentDataErrorElement = document.getElementById('comment-input-error');
        this.chosenCategory = null;
        this.chosenDate = null;
        this.amount = null;

        if (type === 'income') {
            this.typeDataElement.value = 'Доход';
            this.titlePartElement.innerText = 'дохода';
        } else if (type === 'expense') {
            this.typeDataElement.value = 'Расход';
            this.titlePartElement.innerText = 'расхода';
        }
        this.init();
        this.addCategoryOptions(type);
    }

    async init() {
        const that = this;
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();

        this.amountDataElement.addEventListener('keydown', function (event) {
            if (isNaN(event.key) && event.key !== 'Backspace') {
                event.preventDefault();
            }
        });
        this.dateDataElement.addEventListener('focus', function () {
            this.type = 'date';
        });
        this.amountDataElement.addEventListener('change', function () {
            that.amount = parseInt(this.value);
        });
        this.dateDataElement.addEventListener('change', function () {
            that.chosenDate = this.value;
        });
    }

    async addCategoryOptions(type) {
        let result = null;
        if (type === 'income') {
            result = await HttpUtils.request('/categories/income');
        } else if (type === 'expense') {
            result = await HttpUtils.request('/categories/expense');
        }

        if (result) {
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
            }
            if (result.response) {
                this.showCategoryOptions(result.response);
            }
        }
        this.createClass(type);
    }

    showCategoryOptions(result) {
        const that = this;
        result.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('optionId', option.id);
            optionElement.setAttribute('value', option.title);
            optionElement.setAttribute('name', 'category');
            optionElement.setAttribute('class', 'category');
            optionElement.innerText = option.title;
            this.categoryDataElement.appendChild(optionElement);
            this.categoryDataElement.onchange = function () {
                let category = document.querySelectorAll('.category');
                for (let i = 0; i < category.length; i++) {
                    if (category[i].selected) {
                        that.chosenCategory = parseInt(category[i].getAttribute('optionId'));
                    }
                }
            }
        });
    }

    createClass(type) {
        const that = this;
        const actionButton = document.getElementById('create-btn');
        const backButton = document.getElementById('back-btn');
        actionButton.addEventListener('click', async function () {
            if (that.validation()) {
                const newCategory = {
                    type: type,
                    category_id: that.chosenCategory,
                    amount: that.amount,
                    date: that.chosenDate,
                    comment: that.commentDataElement.value,
                }

                const result = await HttpUtils.request('/operations', 'POST', true, newCategory);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }
                if (result.response && result.response.error && result.response.message === 'This record already exists') {
                    return alert('Такая запись уже существует.');
                } else if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при создании дохода/расхода. Обратитесь в поддержку.');
                }

                that.updateBalance(type);
                return that.openNewRoute('/budget');
            }
        });

        backButton.addEventListener('click', function () {
            that.openNewRoute('/budget');
        })
    }

    updateBalance(type){
        let oldBalance = parseInt(this.balanceElement.innerText);
        let newBalance = null;
        if (type === 'income') {
            newBalance = oldBalance + this.amount;
        } else if (type === 'expense') {
            newBalance = oldBalance - this.amount;
        }
        if (newBalance) {
            const update = HttpUtils.request('/balance', 'PUT', true, {
                newBalance: newBalance
            });
            if (update.redirect) {
                return this.openNewRoute(update.redirect);
            }
        }
    }

    validation() {
        let isValid = true;
        if (this.chosenCategory) {
            this.categoryDataElement.classList.remove('is-inValid');
            this.categoryDataErrorElement.style.display = 'none';
        } else {
            this.categoryDataElement.classList.add('is-inValid');
            this.categoryDataErrorElement.style.display = 'block';
            isValid = false;
        }
        if (this.amount) {
            this.amountDataElement.classList.remove('is-inValid');
            this.amountDataErrorElement.style.display = 'none';
        } else {
            this.amountDataElement.classList.add('is-inValid');
            this.amountDataErrorElement.style.display = 'block';
            isValid = false;
        }
        if (this.chosenDate) {
            this.dateDataElement.classList.remove('is-inValid');
            this.dateDataErrorElement.style.display = 'none';
        } else {
            this.dateDataElement.classList.add('is-inValid');
            this.dateDataErrorElement.style.display = 'block';
            isValid = false;
        }
        if (this.commentDataElement.value) {
            this.commentDataElement.classList.remove('is-inValid');
            this.commentDataErrorElement.style.display = 'none';
        } else {
            this.commentDataElement.classList.add('is-inValid');
            this.commentDataErrorElement.style.display = 'block';
            isValid = false;
        }
        return isValid;
    }
}