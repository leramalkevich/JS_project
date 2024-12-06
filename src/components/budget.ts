import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {CommonUtils} from "../utils/common-utils";
import AirDatepicker, {AirDatepickerOptions} from "air-datepicker";
import {CategoryResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Budget {
    readonly openNewRoute: any;
    readonly user: string | null=null;
    readonly userElement: HTMLElement | null|undefined;
    private balanceElement: HTMLElement | null|undefined;
    private buttonElement: HTMLElement | null|undefined;
    private intervalElement: HTMLElement | null|undefined;
    private startDateElement: HTMLElement | null|undefined;
    private endDateElement: HTMLElement | null|undefined;
    private activeButtonElement: HTMLElement |EventTarget| null|undefined;
    private operationsElement: HTMLElement | null|undefined;
    readonly createIncomeButtonElement: HTMLElement | null|undefined;
    readonly createExpenseButtonElement: HTMLElement | null|undefined;
    private from: string | null|undefined;
    private to: string | null|undefined;
    private period: string | null|undefined;


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
        this.operationsElement = document.getElementById('records');
        this.createIncomeButtonElement = document.getElementById('create-income-button');
        this.createExpenseButtonElement = document.getElementById('create-expense-button');
        if (this.createIncomeButtonElement) {
            this.createIncomeButtonElement.addEventListener('click', () => {
                (this.createIncomeButtonElement as HTMLLinkElement).href = "/create-class?type=income";
            });
        }
        if (this.createExpenseButtonElement) {
            this.createExpenseButtonElement.addEventListener('click', () => {
                (this.createExpenseButtonElement as HTMLLinkElement).href = "/create-class?type=expense";
            });
        }

        this.from = null;
        this.to = null;
        this.period = null;

        this.init();
    }

    private async init(): Promise<void> {
        (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
        const that: Budget = this;
        const todayButton: HTMLElement | null = document.getElementById('today-button');
        if (todayButton) {
            todayButton.classList.add("active");
        }
        Array.from((this.buttonElement as HTMLElement).children).forEach(item => {
            item.addEventListener('click', (e): void => {
                (todayButton as HTMLElement).classList.remove("active");
                (this.operationsElement as HTMLElement).innerHTML = '';
                if (this.activeButtonElement && this.activeButtonElement !== e.currentTarget) {
                    (this.activeButtonElement as HTMLElement).classList.remove("active");
                }

                this.activeButtonElement = e.currentTarget;
                (e.currentTarget as HTMLElement).classList.add("active");
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
                                    let fromDate = date.toLocaleString('ru-RU').split(',')[0];
                                    let fromDateArray = fromDate.split('.');
                                    let year = fromDateArray[2];
                                    let month = fromDateArray[1];
                                    let day = fromDateArray[0];
                                    that.from = year + '-' + month + '-' + day;
                                    (that.operationsElement as HTMLElement).innerHTML = '';
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
                        to = new AirDatepicker<HTMLInputElement>('#endDate', {
                            autoClose: true,
                            maxDate: new Date(),
                            onSelect({date}) {
                                (that.intervalElement as HTMLElement).classList.add('active');
                                // (from as AirDatepicker).update({
                                //     maxDate: date
                                // });
                                if (date) {
                                    (that.endDateElement as HTMLInputElement).placeholder = (that.endDateElement as HTMLInputElement).value;
                                    let toDate = date.toLocaleString('ru-RU').split(',')[0];
                                    let toDateArray = toDate.split('.');
                                    let year = toDateArray[2];
                                    let month = toDateArray[1];
                                    let day = toDateArray[0];
                                    that.to = year + '-' + month + '-' + day;
                                    (that.operationsElement as HTMLElement).innerHTML = '';
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
                            // return this.period;
                }

                if (this.period) {
                    this.getOperations().then();
                }
            });
        });

        this.getOperations().then();
    }

    private async getOperations(): Promise<void> {
        const result: CategoryResponseType | DefaultResponseType | Response | null = await HttpUtils.request('/operations?period=' + this.period);
        if (Response.redirect) {
            return this.openNewRoute(Response.redirect);
        }

        if (!result || (result as DefaultResponseType).error || (!(result as DefaultResponseType).error && !(result as CategoryResponseType).response)) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }
        this.showOperations((result as CategoryResponseType).response);
    }

    private showOperations(operations): void {
        for (let i = 0; i < operations.length; i++) {
            const trElement: HTMLTableRowElement | null = document.createElement('tr');
            if (trElement) {
                trElement.insertCell().innerText = (i + 1).toString();
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
                    '</svg>' + '</a>';

                (this.operationsElement as HTMLElement).appendChild(trElement);
            }

        }
        this.deleteOperation();
    }

    private deleteOperation(): void {
        const that: Budget = this;
        let id: number | null = null;
        const deleteButton: HTMLCollection | null = document.getElementsByClassName('delete');
        if (deleteButton) {
            for (let i = 0; i < deleteButton.length; i++) {
                deleteButton[i].addEventListener('click', function (): void {
                    id = parseInt(deleteButton[i].id);
                    that.deleteIncomeCategory(id);
                });
            }
        }
    }

    private deleteIncomeCategory(id: number): void {
        const deleteBtn: HTMLElement | null = document.getElementById('delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async function (): Promise<void> {
                const result: DefaultResponseType | Response | null = await HttpUtils.request('/operations/' + id, 'DELETE', true);
                if (!result || (result as DefaultResponseType).error) {
                    return alert('Возникла ошибка. Обратитесь в поддержку.');
                }
                if (result && !(result as DefaultResponseType).error) {
                    const btn: HTMLElement | null = document.getElementById(id.toString());
                    if (btn) {
                        let deleteActionBlock: ParentNode | null = btn.parentNode;
                        if (deleteActionBlock) {
                            let deleteBlock: ParentNode | null = (deleteActionBlock as ParentNode).parentNode;
                            if(deleteBlock) {
                                (deleteBlock as ParentNode).removeChild(deleteBlock);
                            }
                        }
                    }
                }
            });
        }
    }
}