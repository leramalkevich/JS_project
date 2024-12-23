import {MainPage} from "./components/main-page";
import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {IncomePage} from "./components/income-page";
import {CreateIncome} from "./components/create-income";
import {ExpensesPage} from "./components/expenses-page";
import {EditIncome} from "./components/edit-income";
import {CreateExpenses} from "./components/create-expenses";
import {EditExpenses} from "./components/edit-expenses";
import {Budget} from "./components/budget";
import {EditPage} from "./components/edit-page";
import {CreateClass} from "./components/create-class";
import {Logout} from "./components/auth/logout";
import {CheckUser} from "./utils/check-user-utils";
import {RouteType} from "./types/route.type";
import {AuthUtils} from "./utils/auth-utils";
import {UserInfoResponseType} from "./types/auth-response.type";

export class Router {
    readonly bootstrapIconsStyleElement: HTMLElement | null;
    readonly bootstrapScriptElement: HTMLElement | null;
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes: RouteType[];
    readonly userElement: HTMLElement | null | undefined;

    constructor() {
        this.bootstrapIconsStyleElement = document.getElementById('bootstrap-icons');
        this.bootstrapScriptElement = document.getElementById('bootstrap');
        this.titlePageElement = document.getElementById('title-page');
        this.contentPageElement = document.getElementById('content');
        this.userElement = document.getElementById('user-name');


        this.routes = [
            {
                route: '#/main-page',
                title: 'Главная',
                template: 'templates/index.html',
                load: () => {
                    new MainPage();
                    new CheckUser();
                },
                styles: ['air-datepicker.css'],
                scripts: ['air-datepicker.js', 'chart.umd.js']
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Signup();
                }
            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    new IncomePage();
                    new CheckUser();
                }
            },
            {
                route: '#/create-income',
                title: 'Создать доходы',
                template: 'templates/create-group/income.html',
                load: () => {
                    new CreateIncome();
                    new CheckUser();
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактировать доходы',
                template: 'templates/edit/income.html',
                load: () => {
                    new EditIncome();
                    new CheckUser();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: () => {
                    new ExpensesPage();
                    new CheckUser();
                }
            },
            {
                route: '#/create-expenses',
                title: 'Создать расходы',
                template: 'templates/create-group/expenses.html',
                load: () => {
                    new CreateExpenses();
                    new CheckUser();
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать расходы',
                template: 'templates/edit/expenses.html',
                load: () => {
                    new EditExpenses();
                    new CheckUser();
                }
            },
            {
                route: '#/budget',
                title: 'Доходы и Расходы',
                template: 'templates/budget.html',
                load: () => {
                    new Budget();
                    new CheckUser();
                },
                styles: ['air-datepicker.css'],
                scripts: ['air-datepicker.js']
            },
            {
                route: '#/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit.html',
                load: () => {
                    new EditPage();
                    new CheckUser();
                }
            },
            {
                route: '#/create-class',
                title: 'Создание дохода/расхода',
                template: 'templates/create-class.html',
                load: () => {
                    new CreateClass();
                    new CheckUser();
                }
            },
        ]
        this.initEvents();
    }

    public initEvents(): void {
        // window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        // window.addEventListener('popstate', this.activateRoute.bind(this));

        // document.addEventListener('click', this.clickHandler.bind(this));
        // this.clickHandler();
    }

    public async openNewRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            const result: boolean = await AuthUtils.logout();
            if (result) {
                window.location.href = '#/main-page';
                return;
            }
        }
        const currentRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute
        });
        if (currentRoute) {
            if (currentRoute.styles && currentRoute.styles?.length > 0) {
                currentRoute.styles?.forEach(style => {
                    let styleLink: Element | null = document.querySelector(`link[href='/css/${style}']`);
                    if (styleLink) {
                        (styleLink as Element).remove();
                    }
                });
            }
        }

        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if (!newRoute) {
            window.location.href = '#/main-page';
            return;
        }

        if (!this.contentPageElement || !this.titlePageElement) {
            if (urlRoute === '#/main-page') {
                return;
            } else {
                window.location.href = '#/main-page';
                return;
            }
        }

        this.contentPageElement.innerHTML =
            await fetch(((newRoute as RouteType).template as string)).then(response => response.text());
        // this.stylesElement.setAttribute('href', newRoute.styles);
        this.titlePageElement.innerText = ((newRoute as RouteType).title as string);
        if (newRoute.styles && newRoute.styles?.length > 0) {
            newRoute.styles?.forEach(style => {
                const link: HTMLLinkElement = document.createElement('link');
                if (link) {
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;
                    if (this.bootstrapIconsStyleElement) {
                        document.head.insertBefore(link, this.bootstrapIconsStyleElement);
                    }
                }
            });
        } else {
            newRoute.styles?.forEach(style => {
                let styleLink: Element | null = document.querySelector(`link[href='/css/${style}']`);
                if (styleLink) {
                    (styleLink as Element).remove();
                }
            });
        }

        newRoute.load();
    }
}