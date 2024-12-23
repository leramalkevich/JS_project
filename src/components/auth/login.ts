import config from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";
import {DefaultResponseType} from "../../types/default-response.type";
import {LoginResponseType} from "../../types/auth-response.type";

export class Login {
    readonly emailElement: HTMLElement | null| undefined;
    readonly emailErrorElement: HTMLElement | null| undefined;
    readonly emailSpanElement: HTMLElement | null| undefined;
    readonly passwordElement: HTMLElement | null| undefined;
    readonly passwordErrorElement: HTMLElement | null| undefined;
    readonly passwordSpanElement: HTMLElement | null| undefined;
    private rememberMeElement: HTMLElement | null| undefined;
    readonly commonErrorElement: HTMLElement | null| undefined;

    constructor() {
        this.emailElement = document.getElementById('emailInput');
        this.emailErrorElement = document.getElementById('emailInput-error');
        this.emailSpanElement = document.getElementById('email-span');
        this.passwordElement = document.getElementById('passwordInput');
        this.passwordErrorElement = document.getElementById('passwordInput-error');
        this.passwordSpanElement = document.getElementById('password-span');
        this.rememberMeElement = document.getElementById('rememberMe');
        this.commonErrorElement = document.getElementById('common-error');
        const button: HTMLElement | null = document.getElementById('process-btn');
        if (button) {
            button.addEventListener('click', this.login.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.emailElement && this.emailErrorElement && this.emailSpanElement) {
            if ((this.emailElement as HTMLInputElement).value && (this.emailElement as HTMLInputElement).value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                (this.emailElement as HTMLElement).classList.remove('is-invalid');
                (this.emailErrorElement as HTMLElement).style.display = 'none';
                (this.emailSpanElement as HTMLElement).style.borderColor = '#dee2e6';
            } else {
                (this.emailElement as HTMLElement).classList.add('is-invalid');
                (this.emailErrorElement as HTMLElement).style.display = 'block';
                (this.emailSpanElement as HTMLElement).style.borderColor = '#dc3545';
                isValid = false;
            }
        }
        if (this.passwordElement && this.passwordErrorElement && this.passwordSpanElement) {
            if ((this.passwordElement as HTMLInputElement).value) {
                (this.passwordElement as HTMLElement).classList.remove('is-invalid');
                (this.passwordErrorElement as HTMLElement).style.display = 'none';
                (this.passwordSpanElement as HTMLElement).style.borderColor = '#dee2e6';
            } else {
                (this.passwordElement as HTMLElement).classList.add('is-invalid');
                (this.passwordErrorElement as HTMLElement).style.display = 'block';
                (this.passwordSpanElement as HTMLElement).style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        return isValid;
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            (this.commonErrorElement as HTMLElement).style.display = 'none';
        }
        if (this.validateForm()) {
            try {
                const response: Response = await fetch(config.api + '/login', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: (this.emailElement as HTMLInputElement).value,
                        password: (this.passwordElement as HTMLInputElement).value,
                        rememberMe: (this.rememberMeElement as HTMLInputElement).checked
                    })
                });
                if (response) {
                    const result: DefaultResponseType | LoginResponseType = await response.json();
                    if ((result as DefaultResponseType).error || !(result as LoginResponseType).tokens ||
                        ((result as LoginResponseType).tokens && (!(result as LoginResponseType).tokens.accessToken ||
                            !(result as LoginResponseType).tokens.refreshToken)) || !(result as LoginResponseType).user ||
                        ((result as LoginResponseType).user && (!(result as LoginResponseType).user.name
                            || !(result as LoginResponseType).user.lastName || !(result as LoginResponseType).user.id))) {
                        if (this.commonErrorElement) {
                            this.commonErrorElement.style.display = 'block';
                            return;
                        }
                    }

                    if (result as LoginResponseType) {
                        let userInfo = {
                            id: (result as LoginResponseType).user.id,
                            name: (result as LoginResponseType).user.name + ' ' + (result as LoginResponseType).user.lastName
                        };

                        AuthUtils.setAuthInfo((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken, userInfo);
                    }

                    location.href = '#/main-page';
                }

            } catch (e) {
                console.log(e);
                return ;
            }
        }
    }
}