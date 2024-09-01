import config from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        this.logout().then();
    }

    async logout() {
        await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)})
            }
        );

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}