import config from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    constructor() {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            location.href = '#/login';
            return;
        }
        this.logout().then();
    }

    private async logout(): Promise<void> {
        await fetch(config.api + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)})
            }
        );

        AuthUtils.removeAuthInfo();

        location.href = '#/login';
    }
}