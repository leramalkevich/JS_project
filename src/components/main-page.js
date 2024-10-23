import {Chart} from "chart.js/auto";
import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import AirDatepicker from "air-datepicker";
import {HttpUtils} from "../utils/http-utils";
import {Colors} from 'chart.js';

export class MainPage {
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
        this.incomes = null;
        this.expenses = null;

        this.init();

    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }

        this.balanceElement.innerText = await InfoUtils.getUserData();
        const {Chart, Colors} = await import('chart.js');
        Chart.register(Colors);
        const that = this;
        const todayButton = document.getElementById('today-button');
        todayButton.classList.add("active");
        Array.from(this.buttonElement.children).forEach(item => {
            item.addEventListener('click', (e) => {
                todayButton.classList.remove("active");
                this.incomes.destroy();
                this.expenses.destroy();
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
                                    that.incomes.destroy();
                                    that.expenses.destroy();
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
                                    that.incomes.destroy();
                                    that.expenses.destroy();
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
        const incomeArray = result.response.filter(item => item.type === 'income');
        const expenseArray = result.response.filter(item => item.type === 'expense');
        this.incomePie(incomeArray);
        this.expensesPie(expenseArray);
    }

    async incomePie(incomeArray) {
        const incomeCategories = await HttpUtils.request('/categories/income');
        const categoryLabelsTitles = incomeCategories.response.map(item => item.title);
        let array = [];
        categoryLabelsTitles.forEach(item => {
            let categorySum = incomeArray.filter(amount=> amount.category===item);
            let sum = null;
            for (let i = 0; i < categorySum.length; i++) {
                sum = sum + categorySum[i].amount;
            }
            array.push(sum);
        });

        const income = document.getElementById('incomeChart');
        const data = {
            labels: categoryLabelsTitles,
            datasets: [
                {data: array,}
            ]
        }
        this.incomes = new Chart(income, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    colors: {
                        enabled: true
                    },
                    title: {
                        display: true,
                        text: 'Доходы',
                        font: {
                            size: 28
                        },
                        padding: {
                            top: 30,
                            bottom: 10
                        },
                        color: '#290661'
                    }
                },
            }
        });
    }

    async expensesPie(expenseArray) {
        const expenseCategories = await HttpUtils.request('/categories/expense');
        const categoryLabelsTitles = expenseCategories.response.map(item => item.title);
        let array = [];
        categoryLabelsTitles.forEach(item => {
            let categorySum = expenseArray.filter(amount=> amount.category===item);
            let sum = null;
            for (let i = 0; i < categorySum.length; i++) {
                sum = sum + categorySum[i].amount;
            }
            array.push(sum);
        });

        const expenses = document.getElementById('expensesChart');
        const data = {
            labels: categoryLabelsTitles,
            datasets: [
                {data: array,}
            ]
        }
        this.expenses = new Chart(expenses, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Расходы',
                        font: {
                            size: 28
                        },
                        padding: {
                            top: 30,
                            bottom: 10
                        },
                        color: '#290661'
                    }
                }
            }
        });
    }
}