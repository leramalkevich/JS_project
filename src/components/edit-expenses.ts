import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {CategoriesResponseType} from "../types/categories-response.type";
import {CategoryEditType} from "../types/category-edit.type";
import {DefaultResponseType} from "../types/default-response.type";

export class EditExpenses {
    readonly openNewRoute: any;
    readonly user: string | null = null;
    private userElement: HTMLElement | null | undefined;
    readonly balanceElement: HTMLElement | null | undefined;
    private newParams: CategoryEditType | null = null;

    constructor(openNewRoute) {
        if (typeof openNewRoute === 'function') {
            this.openNewRoute = openNewRoute;
        }

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

        const saveButton = document.getElementById('save-changes');
        if (saveButton) {
            saveButton.addEventListener('click', this.updateCategory.bind(this));
        }

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            const id: string | null = urlParams.get('id');
            const title: string | null = urlParams.get('title');
            if (!id || !title) {
                return this.openNewRoute('/');
            }
            this.init();
            if (id && title) {
                this.changeCategoryTitle(id, title);
            }
        }
    }

    private async init(): Promise<void> {
        if (this.balanceElement) {
            (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
        }
    }

    private changeCategoryTitle(id, title): void {
        const that: EditExpenses = this;
        const backButton: HTMLElement | null = document.getElementById('back-button');
        if (backButton) {
            (backButton as HTMLElement).addEventListener('click', function (): void {
                return that.openNewRoute('/expenses');
            });
        }
        let input: HTMLElement | null = document.getElementById('chosen-category');
        if (input) {
            (input as HTMLInputElement).value = title;
            let newTitle: string = (input as HTMLInputElement).value.toString();
            (input as HTMLElement).addEventListener('input', function (e): void {
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
            const result: DefaultResponseType | CategoriesResponseType | null = await HttpUtils.request('/categories/expense/' + this.newParams.id, 'PUT', true, this.newParams);
            if (!result || (result as DefaultResponseType).error || (!(result as DefaultResponseType).error && !(result as CategoriesResponseType).response)) {
                return alert('Возникла ошибка. Обратитесь в поддержку.');
            }
            if (result && !(result as DefaultResponseType).error && (result as CategoriesResponseType).response) {
                return this.openNewRoute('/expenses');
            }
        }
    }
}