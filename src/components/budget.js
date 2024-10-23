import config from "../../config/config";
import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {CommonUtils} from "../utils/common-utils";
import AirDatepicker from "air-datepicker";

export class Budget {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');
        this.buttonElement = document.getElementById('actions');
        this.intervalElement = document.getElementById('interval');
        this.startDateElement = document.getElementById('startDate');
        this.endDateElement = document.getElementById('endDate');
        this.activeButtonElement = null;
        this.operationsElement = document.getElementById('records');
        this.createIncomeButtonElement = document.getElementById('create-income-button');
        this.createExpenseButtonElement = document.getElementById('create-expense-button');
        this.createIncomeButtonElement.addEventListener('click', () => {
            this.createIncomeButtonElement.href = "/create-class?type=income";
        });
        this.createExpenseButtonElement.addEventListener('click', () => {
            this.createExpenseButtonElement.href = "/create-class?type=expense";
        });
        this.from = null;
        this.to = null;
        this.period = null;

        this.init();
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }
        this.balanceElement.innerText = await InfoUtils.getUserData();
        const that = this;
        const todayButton = document.getElementById('today-button');
        todayButton.classList.add("active");
        Array.from(this.buttonElement.children).forEach(item => {
            item.addEventListener('click', (e) => {
                todayButton.classList.remove("active");
                this.operationsElement.innerHTML = '';
                if (this.activeButtonElement && this.activeButtonElement !== e.currentTarget) {
                    this.activeButtonElement.classList.remove("active");
                }

                this.activeButtonElement = e.currentTarget;
                e.currentTarget.classList.add("active");
                switch (item.innerText.toLowerCase()) {
                    case 'сегодня':
                        this.intervalElement.classList.remove('active');
                        this.startDateElement.value = '';
                        this.startDateElement.placeholder = 'Дата';
                        this.endDateElement.value = '';
                        this.endDateElement.value = 'Дата';
                        this.period = 'today';
                        break;
                    case 'неделя':
                        this.intervalElement.classList.remove('active');
                        this.startDateElement.value = '';
                        this.startDateElement.placeholder = 'Дата';
                        this.endDateElement.value = '';
                        this.endDateElement.value = 'Дата';
                        this.period = 'week';
                        break;
                    case 'месяц':
                        this.intervalElement.classList.remove('active');
                        this.startDateElement.value = '';
                        this.startDateElement.placeholder = 'Дата';
                        this.endDateElement.value = '';
                        this.endDateElement.value = 'Дата';
                        this.period = 'month';
                        break;
                    case 'год':
                        this.intervalElement.classList.remove('active');
                        this.startDateElement.value = '';
                        this.startDateElement.placeholder = 'Дата';
                        this.endDateElement.value = '';
                        this.endDateElement.value = 'Дата';
                        this.period = 'year';
                        break;
                    case 'все':
                        this.intervalElement.classList.remove('active');
                        this.startDateElement.value = '';
                        this.startDateElement.placeholder = 'Дата';
                        this.endDateElement.value = '';
                        this.endDateElement.value = 'Дата';
                        this.period = 'all';
                        break;
                    case 'интервал':
                        this.startDateElement.disabled = false;
                        this.endDateElement.disabled = false;
                        let from = new AirDatepicker('#startDate', {
                            autoClose: true,
                            maxDate: new Date(),
                            onSelect({date}) {
                                that.intervalElement.classList.add('active');
                                to.update({
                                    minDate: date
                                });
                                if (date) {
                                    that.startDateElement.placeholder = that.startDateElement.value;
                                    let fromDate = date.toLocaleString('ru-RU').split(',')[0];
                                    let fromDateArray = fromDate.split('.');
                                    let year = fromDateArray[2];
                                    let month = fromDateArray[1];
                                    let day = fromDateArray[0];
                                    that.from = year + '-' + month + '-' + day;
                                    that.operationsElement.innerHTML = '';
                                    that.period = 'interval&dateFrom=' + that.from + '&dateTo=' + that.to;
                                    that.getOperations().then();
                                }
                            },
                            dateFormat(date) {
                                return date.toLocaleString('ru', {
                                    year: 'numeric',
                                    day: '2-digit',
                                    month: '2-digit'
                                });
                            }
                        });
                        let to = new AirDatepicker('#endDate', {
                            autoClose: true,
                            maxDate: new Date(),
                            onSelect({date}) {
                                that.intervalElement.classList.add('active');
                                from.update({
                                    maxDate: date
                                });
                                if (date) {
                                    that.endDateElement.placeholder = that.endDateElement.value;
                                    let toDate = date.toLocaleString('ru-RU').split(',')[0];
                                    let toDateArray = toDate.split('.');
                                    let year = toDateArray[2];
                                    let month = toDateArray[1];
                                    let day = toDateArray[0];
                                    that.to = year + '-' + month + '-' + day;
                                    that.operationsElement.innerHTML = '';
                                    that.period = 'interval&dateFrom=' + that.from + '&dateTo=' + that.to;
                                    that.getOperations().then();
                                }
                            },
                            dateFormat(date) {
                                return date.toLocaleString('ru', {
                                    year: 'numeric',
                                    day: '2-digit',
                                    month: '2-digit'
                                });
                            }
                        });

                        return this.period;
                }

                if (this.period) {
                    this.getOperations().then();
                }
            });
        });

        this.getOperations().then();
    }

    async getOperations() {
        const result = await HttpUtils.request('/operations?period=' + this.period);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result || result.error || (!result.error && !result.response)) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }
        this.showOperations(result.response);
    }

    showOperations(operations) {
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = CommonUtils.getOperationType(operations[i].type);
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount + '$';
            trElement.insertCell().innerText = new Date(operations[i].date).toLocaleDateString('ru-RU');
            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML =
                '<button class="btn p-0 delete" type="button" data-bs-toggle="modal" data-bs-target="#modalSheet" id="' + operations[i].id + '">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
                '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>' +
                '<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>' +
                '</svg>' + '</button>' + '<a href="/edit?id=' + operations[i].id + '" class="btn p-0">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">' +
                '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>' +
                '</svg>' + '</a>'

            this.operationsElement.appendChild(trElement);
        }
        this.deleteOperation();
    }

    deleteOperation() {
        const that = this;
        let id = null;
        const deleteButton = document.getElementsByClassName('delete');
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
            const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);
            if (!result || result.error || (!result.error && !result.response)) {
                return alert('Возникла ошибка. Обратитесь в поддержку.');
            }
            if (result && !result.error) {
                const btn = document.getElementById(id);
                let deleteActionBlock = btn.parentNode;
                let deleteBlock = deleteActionBlock.parentNode;
                deleteBlock.remove();
            }
        })
    }
}