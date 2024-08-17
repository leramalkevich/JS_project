import config from "../../config/config";

export class CreateUser {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.userNameElement = document.getElementById('userInput');
        this.userErrorElement = document.getElementById('userInput-error');
        this.userSpanElement = document.getElementById('user-span');
        this.emailElement = document.getElementById('emailInput');
        this.emailErrorElement = document.getElementById('emailInput-error');
        this.emailSpanElement = document.getElementById('email-span');
        this.passwordElement = document.getElementById('passwordInput');
        this.passwordErrorElement = document.getElementById('passwordInput-error');
        this.passwordSpanElement = document.getElementById('password-span');
        this.passwordRepeatElement = document.getElementById('passwordRepeatInput');
        this.passwordRepeatErrorElement = document.getElementById('passwordRepeatInput-error');
        this.passwordRepeatSpanElement = document.getElementById('passwordRepeat-span');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-btn').addEventListener('click', this.signup.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.userNameElement.value && this.userNameElement.value.match(/^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+\s*$/)) {
            this.userNameElement.classList.remove('is-invalid');
            this.userErrorElement.style.display = 'none';
            this.userSpanElement.style.borderColor = '#dee2e6';
        } else {
            this.userNameElement.classList.add('is-invalid');
            this.userErrorElement.style.display = 'block';
            this.userSpanElement.style.borderColor = '#dc3545';
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.style.display = 'none';
            this.emailSpanElement.style.borderColor = '#dee2e6';
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.style.display = 'block';
            this.emailSpanElement.style.borderColor = '#dc3545';
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.style.display = 'none';
            this.passwordSpanElement.style.borderColor = '#dee2e6';
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.style.display = 'block';
            this.passwordSpanElement.style.borderColor = '#dc3545';
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatErrorElement.style.display = 'none';
            this.passwordRepeatSpanElement.style.borderColor = '#dee2e6';
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatErrorElement.style.display = 'block';
            this.passwordRepeatSpanElement.style.borderColor = '#dc3545';
            isValid = false;
        }

        return isValid;
    }

    async signup() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            console.log(this.userNameElement.value);
            let user = this.userNameElement.value;
            let array = user.split(' ');
            console.log(array[0]);
            let userName = array[1];
            let userSurname = array[0];
            const response = await fetch(config.host + '/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    lastName: userSurname,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value
                })
            });

            const result = await response.json();

            if (result.error || !result.response) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            console.log(result);

            localStorage.setItem('userInfo', JSON.stringify({id: result.user.id, name: result.user.name + ' ' + result.user.lastName}));

            this.openNewRoute('/');
        }
    }
}