import {Chart} from "chart.js/auto";
import config from "../../config/config";
import {AuthUtils} from "../utils/auth-utils";
import {InfoUtils} from "../utils/info-utils";

export class MainPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.user = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        console.log(this.user);
        if (!this.user) {
            this.openNewRoute('/login');
        }

        this.userElement = document.getElementById('user-name');
        this.balanceElement = document.getElementById('balance');

        this.init();
        this.incomePie();
        this.expensesPie();
    }

    async init() {
        if (this.user.name) {
            this.userElement.innerText = this.user.name;
        }

        this.balanceElement.innerText = await InfoUtils.getUserData();
    }

    incomePie() {
        const income = document.getElementById('incomeChart');
        const data = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [300, 500, 150, 150, 90],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                    ],
                }
            ]
        }
        new Chart(income, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Доходы',
                        font: {
                            size: 28
                        },
                        padding: {
                            top: 30,
                            bottom: 10
                        },
                        color: '#290661'
                    }
                },
            }
        });
    }

    expensesPie() {
        const expenses = document.getElementById('expensesChart');
        const data = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [300, 500, 150, 150, 90],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                    ],
                }
            ]
        }
        new Chart(expenses, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Расходы',
                        font: {
                            size: 28
                        },
                        padding: {
                            top: 30,
                            bottom: 10
                        },
                        color: '#290661'
                    }
                }
            }
        });
    }
}