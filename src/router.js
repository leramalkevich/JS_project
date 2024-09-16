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

export class Router {
    constructor() {
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
                }
            },
            {
                route: '/login',
                title: 'Вход',
                template: 'templates/login.html',
                load: ()=>{
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: ()=>{
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
                load: ()=>{
                    new IncomePage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-income',
                title: 'Создать доходы',
                template: 'templates/create-group/income.html',
                load: ()=>{
                    new CreateIncome(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/edit-income',
                title: 'Редактировать доходы',
                template: 'templates/edit/income.html',
                load: ()=>{
                    new EditIncome(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: ()=>{
                    new ExpensesPage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-expenses',
                title: 'Создать расходы',
                template: 'templates/create-group/expenses.html',
                load: ()=>{
                    new CreateExpenses(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/edit-expenses',
                title: 'Редактировать расходы',
                template: 'templates/edit/expenses.html',
                load: ()=>{
                    new EditExpenses(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/budget',
                title: 'Доходы и Расходы',
                template: 'templates/budget.html',
                load: ()=>{
                    new Budget(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit.html',
                load: ()=>{
                    new EditPage(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
            {
                route: '/create-class',
                title: 'Создание дохода/расхода',
                template: 'templates/create-class.html',
                load: ()=>{
                    new CreateClass(this.openNewRoute.bind(this));
                    new CheckUser();
                }
            },
        ]
    }

    initEvents() {
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
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
            await this.activateRoute();
        }
    }
}