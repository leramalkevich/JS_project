import config from "../../../config/config";
import {DefaultResponseType} from "../../types/default-response.type";
import {LoginResponseType, SignUpResponseType} from "../../types/auth-response.type";
import {AuthUtils} from "../../utils/auth-utils";

export class Signup {
    readonly userNameElement: HTMLElement | null | undefined;
    readonly userErrorElement: HTMLElement | null | undefined;
    readonly userSpanElement: HTMLElement | null | undefined;
    readonly emailElement: HTMLElement | null | undefined;
    readonly emailErrorElement: HTMLElement | null | undefined;
    readonly emailSpanElement: HTMLElement | null | undefined;
    readonly passwordElement: HTMLElement | null | undefined;
    readonly passwordErrorElement: HTMLElement | null | undefined;
    readonly passwordSpanElement: HTMLElement | null | undefined;
    readonly passwordRepeatElement: HTMLElement | null | undefined;
    readonly passwordRepeatErrorElement: HTMLElement | null | undefined;
    readonly passwordRepeatSpanElement: HTMLElement | null | undefined;
    readonly commonErrorElement: HTMLElement | null | undefined;


    constructor() {
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
        const button: HTMLElement | null = document.getElementById('process-btn');
        if (button) {
            button.addEventListener('click', this.signup.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid = true;
        if (this.userNameElement && this.userErrorElement && this.userSpanElement) {
            if ((this.userNameElement as HTMLInputElement).value && (this.userNameElement as HTMLInputElement).value.match(/^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+\s*$/)) {
                (this.userNameElement as HTMLInputElement).classList.remove('is-invalid');
                this.userErrorElement.style.display = 'none';
                this.userSpanElement.style.borderColor = '#dee2e6';
            } else {
                (this.userNameElement as HTMLInputElement).classList.add('is-invalid');
                this.userErrorElement.style.display = 'block';
                this.userSpanElement.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        if (this.emailElement && this.emailErrorElement && this.emailSpanElement) {
            if ((this.emailElement as HTMLInputElement).value && (this.emailElement as HTMLInputElement).value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                this.emailElement.classList.remove('is-invalid');
                this.emailErrorElement.style.display = 'none';
                this.emailSpanElement.style.borderColor = '#dee2e6';
            } else {
                this.emailElement.classList.add('is-invalid');
                this.emailErrorElement.style.display = 'block';
                this.emailSpanElement.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        if (this.passwordElement && this.passwordErrorElement && this.passwordSpanElement) {
            if ((this.passwordElement as HTMLInputElement).value && (this.passwordElement as HTMLInputElement).value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
                this.passwordElement.classList.remove('is-invalid');
                this.passwordErrorElement.style.display = 'none';
                this.passwordSpanElement.style.borderColor = '#dee2e6';
            } else {
                this.passwordElement.classList.add('is-invalid');
                this.passwordErrorElement.style.display = 'block';
                this.passwordSpanElement.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        if (this.passwordRepeatElement && this.passwordRepeatErrorElement && this.passwordRepeatSpanElement) {
            if ((this.passwordRepeatElement as HTMLInputElement).value && (this.passwordRepeatElement as HTMLInputElement).value === (this.passwordElement as HTMLInputElement).value) {
                (this.passwordRepeatElement as HTMLElement).classList.remove('is-invalid');
                (this.passwordRepeatErrorElement as HTMLElement).style.display = 'none';
                (this.passwordRepeatSpanElement as HTMLElement).style.borderColor = '#dee2e6';
            } else {
                this.passwordRepeatElement.classList.add('is-invalid');
                this.passwordRepeatErrorElement.style.display = 'block';
                this.passwordRepeatSpanElement.style.borderColor = '#dc3545';
                isValid = false;
            }
        }

        return isValid;
    }

    private async signup(): Promise<void> {
        (this.commonErrorElement as HTMLElement).style.display = 'none';
        if (this.validateForm()) {
            const user: string = (this.userNameElement as HTMLInputElement).value;
            const array: string[] = user.split(' ');
            const userName: string = array[1];
            const userSurname: string = array[0];
            const response: Response = await fetch(config.api + '/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    lastName: userSurname,
                    email: (this.emailElement as HTMLInputElement).value,
                    password: (this.passwordElement as HTMLInputElement).value,
                    passwordRepeat: (this.passwordRepeatElement as HTMLInputElement).value
                })
            });
            if (response) {
                const result: DefaultResponseType | SignUpResponseType = await response.json();

                if ((result as DefaultResponseType).error || !(result as SignUpResponseType).user || ((result as SignUpResponseType).user
                    && (!(result as SignUpResponseType).user.id || !(result as SignUpResponseType).user.email
                        || !(result as SignUpResponseType).user.name || !(result as SignUpResponseType).user.lastName))) {
                    (this.commonErrorElement as HTMLElement).style.display = 'block';
                    return;
                }

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
                        })
                    });
                    if (response) {
                        const result: DefaultResponseType | LoginResponseType = await response.json();
                        if ((result as DefaultResponseType).error || !(result as LoginResponseType).tokens ||
                            ((result as LoginResponseType).tokens && (!(result as LoginResponseType).tokens.accessToken ||
                                !(result as LoginResponseType).tokens.refreshToken)) || !(result as LoginResponseType).user ||
                            ((result as LoginResponseType).user && (!(result as LoginResponseType).user.name
                                || !(result as LoginResponseType).user.lastName || !(result as LoginResponseType).user.id))) {
                            return;
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
                    return;
                }
            }
        }
    }
}