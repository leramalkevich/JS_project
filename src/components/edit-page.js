import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";

export class EditPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');
        this.typeElement = document.getElementById('typeOptions');
        this.categoryElement = document.getElementById('categoryOptions');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentDataElement = document.getElementById('comment-input');
        this.date = null;
        this.originalCategory = null;
        this.chosenCategory = null;
        const that = this;
        document.getElementById('updateButton').addEventListener('click', this.updateOption.bind(this));
        document.getElementById('backButton').addEventListener('click', function () {
            that.openNewRoute('/budget');
        });
        this.init(id);
    }

    async init(id) {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
        this.amountElement.onkeydown = function (event) {
            if (isNaN(event.key) && event.key !== 'Backspace') {
                event.preventDefault();
            }
        };
        this.dateElement.onfocus = function () {
            this.type = 'date';
        };

        const result = await HttpUtils.request('/operations/' + id);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
            }
            if (result.response) {
                this.originalData = result.response;
                this.showOptionToUpdate(result.response);
            }
    }

    async showOptionToUpdate(option) {
        let result = null;
        for (let i = 0; i < this.typeElement.options.length; i++) {
            if (this.typeElement.options[i].value === this.originalData.type) {
                this.typeElement.options[i].selectedIndex = i;
            }
        }
        const that = this;
        this.typeElement.addEventListener('change', async function () {
            document.querySelectorAll('#categoryOptions option').forEach(option => option.remove())
            if (that.typeElement.value === 'income') {
                result = await HttpUtils.request('/categories/income');
            } else if (that.typeElement.value === 'expense') {
                result = await HttpUtils.request('/categories/expense');
            }
            if (result.response) {
                that.showCategoryOptions(result.response);
            }
        })
        if (option.type === 'income') {
            result = await HttpUtils.request('/categories/income');
        } else if (option.type === 'expense') {
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

        // for (let i = 0; i < this.categoryElement.options.length; i++) {
        //     if (this.categoryElement.options[i].value === option.category) {
        //         this.categoryElement.options[i].selectedIndex = i;
        //         console.log(this.categoryElement.options[this.categoryElement.selectedIndex].getAttribute('optionId'));
        //     }
        // }
        this.categoryElement.value = option.category;
        this.amountElement.value = option.amount;
        this.date = option.date;
        this.dateElement.value = this.date.toLocaleString().split('-').reverse().join('.');
        this.commentDataElement.value = option.comment;
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
            this.categoryElement.appendChild(optionElement);

            this.categoryElement.onchange = function () {
                let category = document.querySelectorAll('.category');
                for (let i = 0; i < category.length; i++) {
                    if (category[i].selected) {
                        that.chosenCategory = category[i].getAttribute('optionId');
                        console.log(that.chosenCategory);
                    }
                }
            }
        });
        for (let i = 0; i < this.categoryElement.options.length; i++) {
            if (this.categoryElement.options[i].value === this.originalData.category) {
                this.categoryElement.options[i].selectedIndex = i;
                this.originalCategory = this.categoryElement.options[i].getAttribute('optionId');
                console.log(this.categoryElement.options[i].getAttribute('optionId'));
                console.log(this.originalCategory);
            }
        }
    }

    validate() {
        let isValid = true;

        let textInputArray = [this.typeElement, this.categoryElement, this.amountElement,
            this.dateElement, this.commentDataElement];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }


    async updateOption(e) {
        e.preventDefault();

        if (this.validate()) {
            const changedData = {};
            if (this.typeElement.value !== this.originalData.type) {
                changedData.type = this.typeElement.value;
            } else {
                changedData.type = this.originalData.type;
            }
            if (this.categoryElement.value !== this.originalData.category) {
                changedData.category_id = this.chosenCategory;
            } else {
                changedData.category_id = this.originalCategory;
            }
            if (this.amountElement.value !== this.originalData.amount) {
                changedData.amount = this.amountElement.value;
            } else {
                changedData.amount = this.originalData.amount;
            }
            if (this.date !== this.originalData.date) {
                changedData.date = this.dateElement.value;
            } else {
                changedData.date = this.originalData.date;
            }
            if (this.commentDataElement.value !== this.originalData.comment) {
                changedData.comment = this.commentDataElement.value;
            } else {
                changedData.comment = this.originalData.comment;
            }

            console.log(changedData);
            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/operations/' + this.originalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response) {
                    return alert('Возникла ошибка при редактировании. Обратитесь в поддержку.');
                }

                return this.openNewRoute('/budget');
            }
        }
    }

}