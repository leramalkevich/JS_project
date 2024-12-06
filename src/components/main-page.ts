import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import AirDatepicker from "air-datepicker";
import {HttpUtils} from "../utils/http-utils";
import {Chart} from 'chart.js';
// import {Colors} from 'chart.js';
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesResponseType, CategoryResponseType} from "../types/categories-response.type";
import config from "../../config/config";

export class MainPage {
    readonly openNewRoute: any;
    readonly user: string | null = null;
    private userElement: HTMLElement | null | undefined;
    private balanceElement: HTMLElement | null | undefined;
    private buttonElement: HTMLElement | null | undefined;
    private intervalElement: HTMLElement | null | undefined;
    private startDateElement: HTMLElement | null | undefined;
    private endDateElement: HTMLElement | null | undefined;
    private activeButtonElement: HTMLElement | EventTarget | null | undefined;
    private incomes: Chart<"pie", number[], string> | null=null;
    private expenses: Chart<"pie", number[], string> | null;
    private period: string | null = null;
    private from: any | null = null;
    private to: any | null = null;

    constructor(openNewRoute) {
        if (typeof openNewRoute === 'function') {
            this.openNewRoute = openNewRoute;
        }
        this.userElement = document.getElementById('user-name');
        this.user = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (this.user) {
            const user = JSON.parse(this.user);
            if (user.name) {
                (this.userElement as HTMLElement).innerText = user.name;
            }
        }
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

    private async init(): Promise<void> {
        (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
        // Chart.register(Colors);
        const that: MainPage = this;
        const todayButton: HTMLElement | null = document.getElementById('today-button');
        (todayButton as HTMLElement).classList.add("active");
        Array.from((this.buttonElement as HTMLElement).children).forEach(item => {
            item.addEventListener('click', (event) => {
                (todayButton as HTMLElement).classList.remove("active");
                if(this.incomes) {
                    (this.incomes as Chart).destroy();
                }
                if(this.expenses) {
                    (this.expenses as Chart).destroy();
                }
                if (this.activeButtonElement && this.activeButtonElement !== event.currentTarget) {
                    (this.activeButtonElement as HTMLElement).classList.remove("active");
                }

                this.activeButtonElement = event.currentTarget;
                (event.currentTarget as HTMLElement).classList.add("active");
                switch ((item as HTMLElement).innerText.toLowerCase()) {
                    case 'сегодня':
                        (this.intervalElement as HTMLElement).classList.remove('active');
                        (this.startDateElement as HTMLInputElement).value = '';
                        (this.startDateElement as HTMLInputElement).placeholder = 'Дата';
                        (this.endDateElement as HTMLInputElement).value = '';
                        (this.endDateElement as HTMLInputElement).value = 'Дата';
                        this.period = 'today';
                        break;
                    case 'неделя':
                        (this.intervalElement as HTMLElement).classList.remove('active');
                        (this.startDateElement as HTMLInputElement).value = '';
                        (this.startDateElement as HTMLInputElement).placeholder = 'Дата';
                        (this.endDateElement as HTMLInputElement).value = '';
                        (this.endDateElement as HTMLInputElement).value = 'Дата';
                        this.period = 'week';
                        break;
                    case 'месяц':
                        (this.intervalElement as HTMLElement).classList.remove('active');
                        (this.startDateElement as HTMLInputElement).value = '';
                        (this.startDateElement as HTMLInputElement).placeholder = 'Дата';
                        (this.endDateElement as HTMLInputElement).value = '';
                        (this.endDateElement as HTMLInputElement).value = 'Дата';
                        this.period = 'month';
                        break;
                    case 'год':
                        (this.intervalElement as HTMLElement).classList.remove('active');
                        (this.startDateElement as HTMLInputElement).value = '';
                        (this.startDateElement as HTMLInputElement).placeholder = 'Дата';
                        (this.endDateElement as HTMLInputElement).value = '';
                        (this.endDateElement as HTMLInputElement).value = 'Дата';
                        this.period = 'year';
                        break;
                    case 'все':
                        (this.intervalElement as HTMLElement).classList.remove('active');
                        (this.startDateElement as HTMLInputElement).value = '';
                        (this.startDateElement as HTMLInputElement).placeholder = 'Дата';
                        (this.endDateElement as HTMLInputElement).value = '';
                        (this.endDateElement as HTMLInputElement).value = 'Дата';
                        this.period = 'all';
                        break;
                    case 'интервал':
                        (this.startDateElement as HTMLInputElement).disabled = false;
                        (this.endDateElement as HTMLInputElement).disabled = false;
                        let from: AirDatepicker<HTMLInputElement> | null = null;
                        let to: AirDatepicker<HTMLInputElement> | null = null;
                        from = new AirDatepicker<HTMLInputElement>('#startDate', {
                            autoClose: true,
                            maxDate: new Date(),
                            onSelect({date}) {
                                (that.intervalElement as HTMLElement).classList.add('active');
                                // (to as AirDatepicker).update({
                                //     minDate: date
                                // });
                                if (date) {
                                    (that.startDateElement as HTMLInputElement).placeholder = (that.startDateElement as HTMLInputElement).value;
                                    let fromDate: string = date.toLocaleString('ru-RU').split(',')[0];
                                    let fromDateArray: string[] = fromDate.split('.');
                                    let year: string = fromDateArray[2];
                                    let month: string = fromDateArray[1];
                                    let day: string = fromDateArray[0];
                                    that.from = year + '-' + month + '-' + day;
                                    (that.incomes as Chart).destroy();
                                    (that.expenses as Chart).destroy();
                                    that.period = 'interval&dateFrom=' + that.from + '&dateTo=' + that.to;
                                    that.getOperations().then();
                                }
                            },
                            dateFormat(date: Date) {
                                return date.toLocaleString('ru', {
                                    year: 'numeric',
                                    day: '2-digit',
                                    month: '2-digit'
                                });
                            }
                        });
                        to = new AirDatepicker<HTMLInputElement>('#endDate', {
                            autoClose: true,
                            maxDate: new Date(),
                            onSelect({date}) {
                                (that.intervalElement as HTMLElement).classList.add('active');
                                    // (from as AirDatepicker<HTMLInputElement>).update({
                                    //     maxDate: date
                                    // });
                                if (date) {
                                    (that.endDateElement as HTMLInputElement).placeholder = (that.endDateElement as HTMLInputElement).value;
                                    let toDate: string = date.toLocaleString('ru-RU').split(',')[0];
                                    let toDateArray: string[] = toDate.split('.');
                                    let year: string = toDateArray[2];
                                    let month: string = toDateArray[1];
                                    let day: string = toDateArray[0];
                                    that.to = year + '-' + month + '-' + day;
                                    (that.incomes as Chart).destroy();
                                    (that.expenses as Chart).destroy();
                                    that.period = 'interval&dateFrom=' + that.from + '&dateTo=' + that.to;
                                    that.getOperations().then();
                                }
                            },
                            dateFormat(date: Date) {
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

    private async getOperations(): Promise<void> {
        const result: DefaultResponseType | Response | CategoryResponseType | null = await HttpUtils.request('/operations?period=' + this.period);
        if (Response.redirect) {
            return this.openNewRoute(Response.redirect);
        }

        if (!result || (result as DefaultResponseType).error || (!(result as DefaultResponseType).error && !(result as CategoryResponseType).response)) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }
        const incomeArray = [(result as CategoryResponseType).response].filter(item => item.type === config.operationType.income);
        const expenseArray = [(result as CategoryResponseType).response].filter(item => item.type === config.operationType.expense);
        this.incomePie(incomeArray).then();
        this.expensesPie(expenseArray).then();
    }

    private async incomePie(incomeArray: any[]): Promise<void> {
        const incomeCategories: CategoriesResponseType | DefaultResponseType | Response | null = await HttpUtils.request('/categories/income');
        const categoryLabelsTitles: string[] = [(incomeCategories as CategoriesResponseType).response].map(item => item.title);
        let array: number[] = [];
        categoryLabelsTitles.forEach(item => {
            let categorySum:any[] = incomeArray.filter(amount => amount.category === item);
            if (categorySum) {
                let sum: number | null = null;
                for (let i = 0; i < (categorySum as Array<any>).length; i++) {
                    sum = sum! + parseInt(categorySum[i].amount);
                }
                if (sum) {
                    array.push((sum as number));
                }
            }
        });

        const income = document.getElementById('incomeChart') as HTMLCanvasElement;
        const data = {
            labels: categoryLabelsTitles,
            datasets: [
                {data: array,}
            ]
        };

        if (income as HTMLCanvasElement) {
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
    }

    private async expensesPie(expenseArray:any[]): Promise<void> {
        const expenseCategories: CategoriesResponseType | DefaultResponseType | Response | null = await HttpUtils.request('/categories/expense');
        const categoryLabelsTitles: string[] = [(expenseCategories as CategoriesResponseType).response].map(item => item.title);
        let array: number[] = [];
        categoryLabelsTitles.forEach(item => {
            let categorySum:any[] = expenseArray.filter(amount => amount.category === item);
            if (categorySum) {
                let sum: number | null = null;
                for (let i = 0; i < (categorySum as Array<any>).length; i++) {
                    sum = sum! + parseInt(categorySum[i].amount);
                }
                if (sum) {
                    array.push(sum as number);
                }
            }
        });

        const expenses = document.getElementById('expensesChart') as HTMLCanvasElement;
        const data = {
            labels: categoryLabelsTitles,
            datasets: [
                {data: array,}
            ]
        }
        if (expenses) {
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
}