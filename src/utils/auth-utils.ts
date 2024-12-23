import config from "../../config/config";
import {RefreshResponseErrorType, RefreshResponseType, UserInfoResponseType} from "../types/auth-response.type";
import {LogoutResponseType} from "../types/logout-response.type";
import {UserInfoType} from "../types/auth-utils.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string | null, refreshToken: string | null, userInfo: UserInfoType | null = null): void {
        if (accessToken) {
            localStorage.setItem(this.accessTokenKey, accessToken);
        }
        if (refreshToken) {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static getAuthInfo(key: string | null = null): string | null {
        if (key === this.accessTokenKey) {
            return localStorage.getItem(this.accessTokenKey);
        } else if (key === this.refreshTokenKey) {
            return localStorage.getItem(this.refreshTokenKey);
        } else if (key === this.userInfoKey) {
            return localStorage.getItem(this.userInfoKey);
        } else {
            return null;
        }
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static async logout(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    AuthUtils.removeTokens();
                    localStorage.removeItem(this.userInfoKey);
                    return true;
                }
            }
        }
        return false;
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (!response) {
                this.removeAuthInfo();
            }
            if (response) {
                const tokens: RefreshResponseType | RefreshResponseErrorType = await response.json();
                if (response.status === 200 && tokens && tokens as RefreshResponseType) {
                    this.setAuthInfo((tokens as RefreshResponseType).tokens.accessToken, (tokens as RefreshResponseType).tokens.refreshToken);
                    result = true;
                } else {
                    this.removeAuthInfo();
                }
            }
        }
        return result;
    }

    public static getUserInfo(): UserInfoResponseType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}