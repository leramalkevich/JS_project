import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {CreateClass} from "../types/category-create.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesResponseType} from "../types/categories-response.type";

export class CreateIncome {
    readonly user: string | null;
    private userElement: HTMLElement | null;
    private balanceElement: HTMLElement | null;

    constructor() {
        this.user = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        this.userElement = document.getElementById('user-name');
        if (this.user) {
            const user = JSON.parse(this.user);
            if (user.name) {
                (this.userElement as HTMLElement).innerText = user.name;
            }
        }
        this.balanceElement = document.getElementById('balance');
        this.init();
    }

    private async init(): Promise<void> {
        (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
        this.createIncomeCategory();
    }

    private createIncomeCategory(): void {
        const that: CreateIncome = this;
        const newCategoryTitle: HTMLElement | null = document.getElementById('new-category-title');
        const actionButton: HTMLElement | null = document.getElementById('create-btn');
        const backButton: HTMLElement | null = document.getElementById('back-btn');
        if (actionButton) {
            actionButton.addEventListener('click', async function (): Promise<void> {
                if ((newCategoryTitle as HTMLInputElement).value && (newCategoryTitle as HTMLInputElement).value.match(/^[А-Я][а-я]+\s*[а-я]*\s*$/)) {
                    const newTitle: CreateClass = {
                        title: (newCategoryTitle as HTMLInputElement).value
                    }
                    const result: DefaultResponseType | CategoriesResponseType | null = await HttpUtils.request('/categories/income', 'POST', true, newTitle);
                    if (result) {
                        if ((result as CategoriesResponseType).response && (result as CategoriesResponseType).response.error
                            && (result as CategoriesResponseType).response.message === 'This record already exists') {
                            return alert('Такая категория уже существует.');
                        } else if ((result as DefaultResponseType).error || !(result as CategoriesResponseType).response
                            || ((result as CategoriesResponseType).response && (result as CategoriesResponseType).response.error)) {
                            console.log((result as CategoriesResponseType).response.message);
                            return alert('Возникла ошибка при добавлении категории. Обратитесь в поддержку.');
                        }

                        location.href = '#/income';
                        return;
                    }
                }
            });

        }
        if (backButton) {
            backButton.addEventListener('click', function () {
                // location.href = '#/income';
                window.history.back();
            })
        }
    }
}