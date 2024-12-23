import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {CategoryEditType} from "../types/category-edit.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesResponseType} from "../types/categories-response.type";

export class EditIncome {
    readonly user: string | null = null;
    private userElement: HTMLElement | null | undefined;
    private saveButton: HTMLElement | null | undefined;
    readonly balanceElement: HTMLElement | null | undefined;
    private newParams: CategoryEditType | null = null;

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
        this.newParams = null;

        this.saveButton = document.getElementById('save-changes');
        if (this.saveButton) {
            this.saveButton.addEventListener('click', this.updateCategory.bind(this));
        }

        const currentUrlParams:string|undefined = document.location.hash.split('?')[1];
        if (currentUrlParams) {
            const urlParams = new URLSearchParams(currentUrlParams);
            if (urlParams) {
                const id: string | null = urlParams.get('id');
                const title: string | null = urlParams.get('title');
                if (!id || !title) {
                    location.href = '#/main-page';
                    return;
                }
                this.init();
                if (id && title) {
                    this.changeCategoryTitle(id, title);
                }
            }
        }
    }

    private async init(): Promise<void> {
        if (this.balanceElement) {
            (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
        }
    }

    private changeCategoryTitle(id: string, title: string): void {
        const that: EditIncome = this;
        const backButton: HTMLElement | null = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', function () {
                // location.href = '#/income';
                window.history.back();
                return;
            });
        }

        let input: HTMLElement | null = document.getElementById('chosen-category');
        if (input) {
            (input as HTMLInputElement).value = title;
            let newTitle: string = (input as HTMLInputElement).value.toString();
            input.addEventListener('input', function (e): void {
                newTitle = (input as HTMLInputElement).value;
                that.newParams = {
                    id: parseInt(id),
                    title: newTitle,
                }
            });
        }
    }

    private async updateCategory(): Promise<void> {
        if (this.newParams) {
            const result: DefaultResponseType | CategoriesResponseType | null = await HttpUtils.request('/categories/income/' + this.newParams.id, 'PUT', true, this.newParams);
            if (!result || (result as DefaultResponseType).error || (!(result as DefaultResponseType).error && !(result as CategoriesResponseType).response)) {
                return alert('Возникла ошибка. Обратитесь в поддержку.');
            }
            if (result && !(result as DefaultResponseType).error && (result as CategoriesResponseType).response) {
                location.href = '#/income';
                return;
            }
        }
    }
}