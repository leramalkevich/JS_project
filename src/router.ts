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

export class Router {
    readonly bootstrapIconsStyleElement: HTMLElement | null;
    readonly bootstrapScriptElement: HTMLElement | null;
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        this.bootstrapIconsStyleElement = document.getElementById('bootstrap-icons');
        this.bootstrapScriptElement = document.getElementById('bootstrap');
        this.titlePageElement = document.getElementById('title-page');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: 'templates/index.html',
                load: () => {
                    new MainPage(this.openNewRoute.bind(this));
                    new CheckUser();
                },
                styles: ['air-datepicker.css'],
                scripts: ['air-datepicker.js', 'chart.umd.js']
            },
            {
                route: '/login',
                title: 'Вход',
                template: 'templates/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Signup(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    new IncomePage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-income',
                title: 'Создать доходы',
                template: 'templates/create-group/income.html',
                load: () => {
                    new CreateIncome(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/edit-income',
                title: 'Редактировать доходы',
                template: 'templates/edit/income.html',
                load: () => {
                    new EditIncome(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: () => {
                    new ExpensesPage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-expenses',
                title: 'Создать расходы',
                template: 'templates/create-group/expenses.html',
                load: () => {
                    new CreateExpenses(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/edit-expenses',
                title: 'Редактировать расходы',
                template: 'templates/edit/expenses.html',
                load: () => {
                    new EditExpenses(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/budget',
                title: 'Доходы и Расходы',
                template: 'templates/budget.html',
                load: () => {
                    new Budget(this.openNewRoute.bind(this));
                    new CheckUser();
                },
                styles: ['air-datepicker.css'],
                scripts: ['air-datepicker.js']
            },
            {
                route: '/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit.html',
                load: () => {
                    new EditPage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-class',
                title: 'Создание дохода/расхода',
                template: 'templates/create-class.html',
                load: () => {
                    new CreateClass(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
        ]
    }

    public initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    public async clickHandler(e): Promise<void> {
        let element: any = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute: string = window.location.pathname;
            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || (typeof url === String('javascript:void(0)'))) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    public async activateRoute(e, oldRoute: null | string = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = (this.routes as RouteType[]).find(item => item.route === oldRoute);
            if (!currentRoute) {
                history.pushState({}, '', '/login');
                return;
            }
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles?.length > 0) {
                    currentRoute.styles?.forEach(style => {
                        let styleLink:Element|null = document.querySelector(`link[href='/css/${style}']`);
                        if (styleLink) {
                            (styleLink as Element).remove();
                        }
                    });
                }
                if (currentRoute.scripts && currentRoute.scripts?.length > 0) {
                    currentRoute.scripts?.forEach(script => {
                        let scriptLink:Element|null = document.querySelector(`script[src='/js/${script}']`);
                        if (scriptLink) {
                            (scriptLink as Element).remove();
                        }
                    });
                }
                // if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                //     currentRoute.unload();
                // }
            }
        }
        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = (this.routes as RouteType[]).find(item => {return item.route === urlRoute});
        if (!newRoute) {
            history.pushState({}, '', '/login');
            return;
        }
        if (newRoute) {
            if (!this.contentPageElement || !this.titlePageElement) {
                if (newRoute.route === '/') {
                    return;
                } else {
                    window.location.href = '/login';
                    return;
                }
            }
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
            }
            if (newRoute.scripts && newRoute.scripts?.length > 0) {
                for (const script of newRoute.scripts) {
                    const scriptBlock: HTMLScriptElement = document.createElement('script') as HTMLScriptElement;
                    if (scriptBlock) {
                        scriptBlock.src = '/js/' + script;
                        scriptBlock.setAttribute('type', 'module');
                        console.log(scriptBlock);
                        document.body.appendChild(scriptBlock);
                    }
                }
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.template) {
                this.contentPageElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/login');
            await this.activateRoute((newRoute as RouteType).route);
        }
    }
}