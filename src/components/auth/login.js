import config from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('emailInput');
        this.emailErrorElement = document.getElementById('emailInput-error');
        this.emailSpanElement = document.getElementById('email-span');
        this.passwordElement = document.getElementById('passwordInput');
        this.passwordErrorElement = document.getElementById('passwordInput-error');
        this.passwordSpanElement = document.getElementById('password-span');
        this.rememberMeElement = document.getElementById('rememberMe');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-btn').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;
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

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.style.display = 'none';
            this.passwordSpanElement.style.borderColor = '#dee2e6';
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.style.display = 'block';
            this.passwordSpanElement.style.borderColor = '#dc3545';
            isValid = false;
        }

        return isValid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
           const response = await fetch(config.host + '/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
            });

           const result = await response.json();

            if (result.error || !result.tokens || result.tokens && (!result.tokens.accessToken || !result.tokens.refreshToken) ||
                !result.user || result.user && (!result.user.name || !result.user.lastName || !result.user.id)) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            console.log(result);

            AuthUtils.setAuthInfo(result.tokens.accessToken, result.tokens.refreshToken, {id: result.user.id, name: result.user.name + ' ' + result.user.lastName})

            this.openNewRoute('/');
        }
    }
}