import {MainPage} from "./components/main-page";
import {Login} from "./components/login";
import {CreateUser} from "./components/create-user";
import {IncomePage} from "./components/income-page";
import {CreateIncome} from "./components/create-income";
import {ExpensesPage} from "./components/expenses-page";
import {EditIncome} from "./components/edit-income";
import {CreateExpenses} from "./components/create-expenses";
import {EditExpenses} from "./components/edit-expenses";
import {Budget} from "./components/budget";
import {EditPage} from "./components/edit-page";
import {CreateClass} from "./components/create-class";

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
                    new MainPage();
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
                route: '/create',
                title: 'Регистрация',
                template: 'templates/create.html',
                load: ()=>{
                    new CreateUser(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: ()=>{
                    new IncomePage();
                }
            },
            {
                route: '/create-income',
                title: 'Создать доходы',
                template: 'templates/create-group/income.html',
                load: ()=>{
                    new CreateIncome();
                }
            },
            {
                route: '/edit-income',
                title: 'Редактировать доходы',
                template: 'templates/edit/income.html',
                load: ()=>{
                    new EditIncome();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: ()=>{
                    new ExpensesPage();
                }
            },
            {
                route: '/create-expenses',
                title: 'Создать расходы',
                template: 'templates/create-group/expenses.html',
                load: ()=>{
                    new CreateExpenses();
                }
            },
            {
                route: '/edit-expenses',
                title: 'Редактировать расходы',
                template: 'templates/edit/expenses.html',
                load: ()=>{
                    new EditExpenses();
                }
            },
            {
                route: '/budget',
                title: 'Доходы и Расходы',
                template: 'templates/budget.html',
                load: ()=>{
                    new Budget();
                }
            },
            {
                route: '/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit.html',
                load: ()=>{
                    new EditPage();
                }
            },
            {
                route: '/create-class',
                title: 'Создание дохода/расхода',
                template: 'templates/create-class.html',
                load: ()=>{
                    new CreateClass();
                }
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
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
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

}
