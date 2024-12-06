import config from "../../config/config";
import {RefreshResponseErrorType, RefreshResponseType} from "../types/auth-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string | null, refreshToken: string | null, userInfo: string | null = null): void {
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
                    this.setAuthInfo((tokens as RefreshResponseType).accessToken, (tokens as RefreshResponseType).refreshToken);
                    result = true;
                } else {
                    this.removeAuthInfo();
                }
            }
        }
        return result;
    }
}