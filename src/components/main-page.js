import {Chart} from "chart.js/auto";

export class MainPage {
    constructor() {
        this.incomePie();
        this.expensesPie();
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