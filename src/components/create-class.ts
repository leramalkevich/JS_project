import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import config from "../../config/config";
import {
    CategoriesResponseType,
    OneTypeResponseType,
    TypeResponse
} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryCreateType} from "../types/category-create.type";

export class CreateClass {
    readonly user: string | null = null;
    private userElement: HTMLElement | null | undefined;
    private balanceElement: HTMLElement | null | undefined;
    private titlePartElement: HTMLElement | null | undefined;
    private typeDataElement: HTMLElement | null | undefined;
    private categoryDataElement: HTMLElement | null | undefined;
    private categoryDataErrorElement: HTMLElement | null | undefined;
    private amountDataElement: HTMLElement | null | undefined;
    private amountDataErrorElement: HTMLElement | null | undefined;
    private dateDataElement: HTMLElement | null | undefined;
    private dateDataErrorElement: HTMLElement | null | undefined;
    private commentDataElement: HTMLElement | null | undefined;
    private commentDataErrorElement: HTMLElement | null | undefined;
    private chosenCategory: number | null = null;
    private chosenDate: string | null = null;
    private amount: number | null = null;

    constructor() {
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

        this.init().then();

        const currentUrlParams:string|undefined = document.location.hash.split('?')[1];
        if (currentUrlParams) {
            const urlParams = new URLSearchParams(currentUrlParams);
            if (urlParams) {
                const type: string | null = urlParams.get('type');
                if (!type) {
                    location.href = '#/main-page';
                    return ;
                }
                if (type === config.operationType.income) {
                    (this.typeDataElement as HTMLInputElement).value = 'Доход';
                    (this.titlePartElement as HTMLElement).innerText = 'дохода';
                } else if (type === config.operationType.expense) {
                    (this.typeDataElement as HTMLInputElement).value = 'Расход';
                    (this.titlePartElement as HTMLElement).innerText = 'расхода';
                }
                this.addCategoryOptions(type).then();
            }
        }

        this.userElement = document.getElementById('user-name');
        this.user = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (this.user) {
            const user = JSON.parse(this.user);
            if (user.name) {
                (this.userElement as HTMLElement).innerText = user.name;
            }
        }
    }

    private async init(): Promise<void> {
        const that: CreateClass = this;

        (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();

        (this.amountDataElement as HTMLInputElement).addEventListener('keydown', function (event: KeyboardEvent) {
            if (isNaN(parseInt(event.key)) && event.key !== 'Backspace') {
                event.preventDefault();
            }
        });
        (this.dateDataElement as HTMLInputElement).addEventListener('focus', function () {
            this.type = 'date';
        });
        (this.amountDataElement as HTMLInputElement).addEventListener('change', function () {
            that.amount = parseInt(this.value);
        });
        (this.dateDataElement as HTMLInputElement).addEventListener('change', function () {
            that.chosenDate = this.value;
        });
    }

    private async addCategoryOptions(type: string): Promise<void> {
        let result: OneTypeResponseType | DefaultResponseType | null = null;
        if (type === config.operationType.income) {
            result = await HttpUtils.request('/categories/income');
        } else if (type === config.operationType.expense) {
            result = await HttpUtils.request('/categories/expense');
        }
        if (result) {
            if ((result as DefaultResponseType).error || !(result as OneTypeResponseType).response) {
                return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
            }
            if ((result as OneTypeResponseType).response) {
                this.showCategoryOptions((result as OneTypeResponseType));
                // this.showCategoryOptions((result as CategoriesResponseType).response);
            }
        }
        this.createClass(type);
    }

    private showCategoryOptions(result:OneTypeResponseType): void {
        const that: CreateClass = this;
        (result.response as Array<TypeResponse>).forEach(option => {
            const optionElement: HTMLElement | null = document.createElement('option');
            if (optionElement) {
                optionElement.setAttribute('optionId', option.id.toString());
                optionElement.setAttribute('value', option.title);
                optionElement.setAttribute('name', 'category');
                optionElement.setAttribute('class', 'category');
                optionElement.innerText = option.title;
                (this.categoryDataElement as HTMLElement).appendChild(optionElement);
            }
        });

        let selectedByDefault: TypeResponse | undefined = result.response.find(item => {
            return item.title === (this.categoryDataElement as HTMLInputElement).value;
        });
        if (selectedByDefault) {
            const selectedId = selectedByDefault.id;
            if (selectedId) {
                this.chosenCategory = selectedId;
            }
        }

        if(this.categoryDataElement) {
            this.categoryDataElement.addEventListener('change', function ():void {
                const categorySelected = that.categoryDataElement?.querySelector('option:checked');
                if (categorySelected) {
                    const choice = categorySelected.getAttribute('optionId');
                    if (choice) {
                        that.chosenCategory = parseInt(choice);
                    }
                }
                // let category: HTMLSelectElement[] = Array.from(document.querySelectorAll('.category'));
                // for (let i = 0; i < category.length; i++) {
                //     if ((category[i] as HTMLSelectElement).selectedOptions) {
                // if ((category[i] as HTMLSelectElement).selected) {
                // let choice = category[i].getAttribute('optionId');
                // if (choice) {
                //     that.chosenCategory = parseInt(choice);
                // }
                // }
                // }
            });
        }
    }

    private createClass(type: string): void {
        const that: CreateClass = this;
        const actionButton: HTMLElement | null = document.getElementById('create-btn');
        const backButton: HTMLElement | null = document.getElementById('back-btn');
        if (actionButton) {
            actionButton.addEventListener('click', async function () {
                if (that.validation()) {
                    let newCategory: CategoryCreateType | null | undefined = {
                        type: type,
                        category_id: that.chosenCategory,
                        amount: that.amount,
                        date: that.chosenDate,
                        comment: (that.commentDataElement as HTMLInputElement).value,
                    }
                    if (!newCategory) {
                        return;
                    }

                    const result: DefaultResponseType | CategoriesResponseType | null = await HttpUtils.request('/operations', 'POST', true, newCategory);
                    if (result) {
                        if ((result as CategoriesResponseType).response && (result as CategoriesResponseType).response.error
                            && (result as CategoriesResponseType).response.message === 'This record already exists') {
                            return alert('Такая запись уже существует.');
                        } else if ((result as DefaultResponseType).error || !(result as CategoriesResponseType).response
                            || ((result as CategoriesResponseType).response && (result as CategoriesResponseType).response.error)) {
                            console.log((result as CategoriesResponseType).response.message);
                            return alert('Возникла ошибка при создании дохода/расхода. Обратитесь в поддержку.');
                        }

                        that.updateBalance(type);
                        location.href = '#/budget';
                        return ;
                    }
                }
            });
        }

        if (backButton) {
            backButton.addEventListener('click', function () {
                // location.href = '#/budget';
                window.history.back();
            })
        }
    }

    private updateBalance(type: string): void {
        let oldBalance: number | null = parseInt((this.balanceElement as HTMLElement).innerText);
        let newBalance: number | null = null;
        if (type === config.operationType.income) {
            if (this.amount) {
                newBalance = oldBalance + this.amount;
            }
        } else if (type === config.operationType.expense) {
            if (this.amount) {
                newBalance = oldBalance - this.amount;
            }
        }
        if (newBalance) {
            const update: any = HttpUtils.request('/balance', 'PUT', true, {
                newBalance: newBalance
            });
            if (update) {
                if (update.redirect) {
                    // return this.openNewRoute(update.redirect);
                    // location.href = update.redirect;
                    return ;
                }
            }
        }
    }

    private validation(): boolean {
        let isValid: boolean = true;
        if (this.chosenCategory) {
            (this.categoryDataElement as HTMLElement).classList.remove('is-inValid');
            (this.categoryDataErrorElement as HTMLElement).style.display = 'none';
        } else {
            (this.categoryDataElement as HTMLElement).classList.add('is-inValid');
            (this.categoryDataErrorElement as HTMLElement).style.display = 'block';
            isValid = false;
        }
        if (this.amount) {
            (this.amountDataElement as HTMLElement).classList.remove('is-inValid');
            (this.amountDataErrorElement as HTMLElement).style.display = 'none';
        } else {
            (this.amountDataElement as HTMLElement).classList.add('is-inValid');
            (this.amountDataErrorElement as HTMLElement).style.display = 'block';
            isValid = false;
        }
        if (this.chosenDate) {
            (this.dateDataElement as HTMLElement).classList.remove('is-inValid');
            (this.dateDataErrorElement as HTMLElement).style.display = 'none';
        } else {
            (this.dateDataElement as HTMLElement).classList.add('is-inValid');
            (this.dateDataErrorElement as HTMLElement).style.display = 'block';
            isValid = false;
        }
        if ((this.commentDataElement as HTMLInputElement).value) {
            (this.commentDataElement as HTMLElement).classList.remove('is-inValid');
            (this.commentDataErrorElement as HTMLElement).style.display = 'none';
        } else {
            (this.commentDataElement as HTMLElement).classList.add('is-inValid');
            (this.commentDataErrorElement as HTMLElement).style.display = 'block';
            isValid = false;
        }
        return isValid;
    }
}