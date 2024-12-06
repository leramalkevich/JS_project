import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {OneTypeResponseType, typeResponse} from "../types/categories-response.type";

export class IncomePage {
    readonly openNewRoute:any;
    readonly user: string | null=null;
    private userElement: HTMLElement | null | undefined;
    private balanceElement: HTMLElement | null| undefined;

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

        this.init();
        this.getIncomeCategories().then();
    }

    async init() {
        (this.balanceElement as HTMLElement).innerText = <string>await InfoUtils.getUserData();
    }

    private async getIncomeCategories(): Promise<void> {
        const result: DefaultResponseType | Response | OneTypeResponseType = await HttpUtils.request('/categories/income')
        if (Response.redirect) {
            return this.openNewRoute(Response.redirect);
        }

        if ((result as DefaultResponseType).error || !(result as OneTypeResponseType).response) {
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
        }

        this.showItems((result as OneTypeResponseType));
    }

    private showItems(result: OneTypeResponseType): void {
        const elements: HTMLElement | null = document.getElementById('categories');
        for (let i = 0; i < (result.response as Array<typeResponse>).length; i++) {
            const colElement: HTMLElement | null = document.createElement('div');
            (colElement as HTMLElement).className = 'col' + ' mb-3';

            const cardElement: HTMLElement | null = document.createElement('div');
            (cardElement as HTMLElement).className = 'card' + ' p-3';
            const cardTitleElement: HTMLElement | null = document.createElement('div');
            (cardTitleElement as HTMLElement).className = 'card-title' + ' fs-4' + ' mb-2' + ' fw-bolder' + ' text-body';
            (cardTitleElement as HTMLElement).innerText = result.response[i].title;
            const cardActionElement: HTMLElement | null = document.createElement('div');
            (cardActionElement as HTMLElement).className = 'card-action';
            (cardActionElement as HTMLElement).innerHTML = '<a href="/edit-income?id=' + result.response[i].id + '&title=' + result.response[i].title + '" class="btn btn-primary me-2 mb-2" type="button">Редактировать</a>' +
                '<button class="btn btn-danger mb-2 delete" id="' + result.response[i].id + '" type="button" data-bs-toggle="modal" data-bs-target="#modalSheet">Удалить</button>';
            if (cardElement && cardTitleElement && cardActionElement && colElement) {
                cardElement.appendChild(cardTitleElement);
                cardElement.appendChild(cardActionElement);

                colElement.appendChild(cardElement);

                (elements as HTMLElement).appendChild(colElement);
            }
        }

        const addElement: HTMLElement | null = document.getElementById('add-button');
        if(addElement) {
            (elements as HTMLElement).appendChild(addElement);
        }

        this.clickDeleteButton();
    }

    private clickDeleteButton():void {
        const deleteButton:HTMLCollection|null = document.getElementsByClassName('delete');
        const that:IncomePage = this;
        let id:number|null = null;
        for (let i = 0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener('click', function () {
                id = parseInt(deleteButton[i].id);
                that.deleteIncomeCategory(id);
            })
        }
    }

    private deleteIncomeCategory(id:number):void {
        const deleteBtn:HTMLElement|null = document.getElementById('delete-btn');
        (deleteBtn as HTMLElement).addEventListener('click', async function ():Promise<void> {
            const result:DefaultResponseType = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
            if (!result || result.error) {
                return alert('Возникла ошибка. Обратитесь в поддержку.');
            }
            if (result && !result.error) {
                const btn:HTMLElement|null = document.getElementById(id.toString());
                if (btn) {
                    let deleteActionBlock:ParentNode|null = (btn as HTMLElement).parentNode;
                    if(deleteActionBlock) {
                        let deleteBlock:ParentNode|null = (deleteActionBlock as ParentNode).parentNode;
                        if(deleteBlock) {
                            let deleteColBlock:ParentNode|null = (deleteBlock as ParentNode).parentNode;
                            if(deleteColBlock) {
                                (deleteColBlock as ParentNode).removeChild(deleteColBlock);
                            }
                        }
                    }
                }
            }
        });
    }
}