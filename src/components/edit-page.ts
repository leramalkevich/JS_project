import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";
import {HttpUtils} from "../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {
    CategoriesResponseType,
    CategoryResponseType, OptionCategoryType
} from "../types/categories-response.type";
import {CategoryType} from "../types/category.type";
import config from "../../config/config";
import {ChangedDataType} from "../types/changedData-type";

export class EditPage {
    readonly user: string | null = null;
    private userElement: HTMLElement | null | undefined;
    readonly balanceElement: HTMLElement | null | undefined;
    readonly typeElement: HTMLElement | null | undefined;
    readonly categoryElement: HTMLElement | null | undefined;
    readonly amountElement: HTMLElement | null | undefined;
    readonly dateElement: HTMLElement | null | undefined;
    readonly commentDataElement: HTMLElement | null | undefined;
    private date: string | Date | null = null;
    private originalCategory: number | undefined;
    private chosenCategory: number | undefined;
    private originalData: CategoryType | null = null;

    constructor() {
        const currentUrlParams: string | undefined = document.location.hash.split('?')[1];
        if (currentUrlParams) {
            const urlParams = new URLSearchParams(currentUrlParams);
            if (urlParams) {
                const id: string | null = urlParams.get('id');
                if (!id) {
                    location.href = '#/main-page';
                    return;
                }
                this.init(id).then();
            }
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
        this.typeElement = document.getElementById('typeOptions');
        this.categoryElement = document.getElementById('categoryOptions');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentDataElement = document.getElementById('comment-input');
        this.date = null;
        // this.originalCategory = null;
        // this.chosenCategory = null;
        const that: EditPage = this;
        (document.getElementById('updateButton') as HTMLElement).addEventListener('click', this.updateOption.bind(this));
        (document.getElementById('backButton') as HTMLElement).addEventListener('click', function (): void {
            // location.href = '#/budget';
            window.history.back();
        });

    }

    private async init(id: string): Promise<void> {
        let balanceString: string | undefined | null = await InfoUtils.getUserData();
        if (balanceString) {
            (this.balanceElement as HTMLElement).innerText = balanceString;
        }
        (this.amountElement as HTMLInputElement).addEventListener('keyup', function (): void {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        const result: DefaultResponseType | CategoryResponseType | null = await HttpUtils.request('/operations/' + id);
        console.log(result);
        if (result) {
            if ((result as DefaultResponseType).error || !(result as CategoryResponseType).response) {
                return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
            }
            if ((result as CategoryResponseType).response) {
                this.originalData = ((result as CategoryResponseType).response as CategoryType);
                this.showOptionToUpdate(((result as CategoryResponseType).response as CategoryType)).then();
            }
        }
    }

    private async showOptionToUpdate(option: CategoryType): Promise<void> {
        const that: EditPage = this;
        let result: DefaultResponseType | CategoriesResponseType | Response | null = null;
        for (let i = 0; i < (this.typeElement as HTMLSelectElement).options.length; i++) {
            if ((this.typeElement as HTMLSelectElement).options[i].value === option.type) {
                ((this.typeElement as HTMLSelectElement).options[i] as unknown as HTMLOptionsCollection).selectedIndex = i;
                (this.typeElement as HTMLSelectElement).options[i].selected = true;
            }
        }
        (this.typeElement as HTMLSelectElement).addEventListener('change', async function (): Promise<void> {
            document.querySelectorAll('#categoryOptions option').forEach(option => option.remove())
            if ((that.typeElement as HTMLSelectElement).value === config.operationType.income) {
                result = await HttpUtils.request('/categories/income');
            } else if ((that.typeElement as HTMLSelectElement).value === config.operationType.expense) {
                result = await HttpUtils.request('/categories/expense');
            }
            if ((result as CategoriesResponseType).response) {
                that.showCategoryOptions((result as CategoriesResponseType));
            }
        })
        if (option.type === config.operationType.income) {
            result = await HttpUtils.request('/categories/income');
        } else if (option.type === config.operationType.expense) {
            result = await HttpUtils.request('/categories/expense');
        }

        if (result) {
            if ((result as DefaultResponseType).error || !(result as CategoriesResponseType).response) {
                return alert('Возникла ошибка при запросе. Обратитесь в поддержку.');
            }
            if ((result as CategoriesResponseType).response) {
                this.showCategoryOptions((result as CategoriesResponseType));
            }
        }

        (this.categoryElement as HTMLInputElement).value = option.category;
        (this.amountElement as HTMLInputElement).value = option.amount.toString();
        this.date = option.date;
        (this.dateElement as HTMLInputElement).value = this.date.toLocaleString();
        (this.commentDataElement as HTMLInputElement).value = option.comment;
    }

    private showCategoryOptions(result: CategoriesResponseType): void {
        const that: EditPage = this;
        console.log(result.response);
        const responseArray: OptionCategoryType[]=Array.isArray(result.response) ? result.response : [result.response as OptionCategoryType];

        responseArray.forEach((option)=>{
            const optionElement: HTMLOptionElement | null = document.createElement('option');
            (optionElement as HTMLOptionElement).setAttribute('optionId', option.id.toString());
            (optionElement as HTMLOptionElement).setAttribute('value', option.title);
            (optionElement as HTMLOptionElement).setAttribute('name', 'category');
            (optionElement as HTMLOptionElement).setAttribute('class', 'category');
            (optionElement as HTMLOptionElement).innerText = option.title;
            if(this.categoryElement) {
                (this.categoryElement as HTMLElement).appendChild(optionElement);
            }
        });
        if(this.categoryElement){
            (this.categoryElement as HTMLOptionElement).onchange = function (): void {
                let category: NodeListOf<HTMLOptionElement> = document.querySelectorAll('.category');
                for (let i = 0; i < category.length; i++) {
                    if ((category[i] as HTMLOptionElement).selected) {
                        let choice = category[i].getAttribute('optionId');
                        if (choice) {
                            that.chosenCategory = parseInt(choice);
                        }
                    }
                }
            }
        }

        // [result.response].forEach(option => {
        //     for (let item in Object.assign(option)) {
        //         const optionElement: HTMLOptionElement | null = document.createElement('option');
        //
        //         let idString: string = ((option as unknown as OptionCategoryType)[item].id).toString();
        //         (optionElement as HTMLOptionElement).setAttribute('optionId', idString);
        //
        //         let titleString: string = ((option as unknown as OptionCategoryType)[item].title).toString();
        //         (optionElement as HTMLOptionElement).setAttribute('value', titleString);
        //         (optionElement as HTMLOptionElement).setAttribute('name', 'category');
        //         (optionElement as HTMLOptionElement).setAttribute('class', 'category');
        //         (optionElement as HTMLOptionElement).innerText = titleString;
        //         (this.categoryElement as HTMLElement).appendChild(optionElement);
        //     }
        //
        //     (this.categoryElement as HTMLOptionElement).onchange = function (): void {
        //         let category: NodeListOf<HTMLOptionElement> = document.querySelectorAll('.category');
        //         for (let i = 0; i < category.length; i++) {
        //             if ((category[i] as HTMLOptionElement).selected) {
        //                 let choice = category[i].getAttribute('optionId');
        //                 if (choice) {
        //                     that.chosenCategory = parseInt(choice);
        //                 }
        //             }
        //         }
        //     }
        // });
        for (let i = 0; i < (this.categoryElement as HTMLSelectElement).options.length; i++) {
            if ((this.categoryElement as HTMLSelectElement).options[i].value === (this.originalData as CategoryType).category) {
                ((this.categoryElement as HTMLSelectElement).options[i] as unknown as HTMLOptionsCollection).selectedIndex = i;
                let orgCategory = (this.categoryElement as HTMLSelectElement).options[i].getAttribute('optionId');
                if (orgCategory) {
                    this.originalCategory = parseInt(orgCategory);
                }
            }
        }
    }

    private validate(): boolean {
        let isValid: boolean = true;
        let textInputArray: (HTMLElement | null | undefined)[] = [this.typeElement, this.categoryElement, this.amountElement,
            this.dateElement, this.commentDataElement];

        for (let i = 0; i < textInputArray.length; i++) {
            if ((textInputArray[i] as HTMLInputElement).value) {
                (textInputArray[i] as HTMLElement).classList.remove('is-invalid');
            } else {
                (textInputArray[i] as HTMLElement).classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }


    private async updateOption(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validate()) {
            const changedData: ChangedDataType = {};
            if ((this.typeElement as HTMLInputElement).value !== (this.originalData as CategoryType).type) {
                changedData.type = (this.typeElement as HTMLSelectElement).value;
            } else {
                changedData.type = (this.originalData as CategoryType).type;
            }
            if ((this.categoryElement as HTMLSelectElement).value !== (this.originalData as CategoryType).category) {
                changedData.category_id = this.chosenCategory;
            } else {
                changedData.category_id = this.originalCategory;
            }
            if (parseInt((this.amountElement as HTMLInputElement).value) !== (this.originalData as CategoryType).amount) {
                changedData.amount = parseInt((this.amountElement as HTMLInputElement).value);
            } else {
                changedData.amount = (this.originalData as CategoryType).amount;
                // changedData.amount = parseInt(this.originalData.amount);
            }
            if ((this.dateElement as HTMLInputElement).value !== (this.originalData as CategoryType).date) {
                changedData.date = (this.dateElement as HTMLInputElement).value;
            } else {
                changedData.date = (this.date as Date);
                // changedData.date = (this.date as Date).toISOString();
            }
            if ((this.commentDataElement as HTMLInputElement).value !== (this.originalData as CategoryType).comment) {
                changedData.comment = (this.commentDataElement as HTMLInputElement).value;
            } else {
                changedData.comment = (this.originalData as CategoryType).comment;
            }

            if (Object.keys(changedData).length > 0) {
                const result: DefaultResponseType | Response | null = await HttpUtils.request('/operations/' + (this.originalData as CategoryType).id, 'PUT', true, changedData);
                if ((result as DefaultResponseType).error) {
                    return alert('Возникла ошибка при редактировании. Обратитесь в поддержку.');
                }

                location.href = '#/budget';
                return;
            }
        }
    }
}