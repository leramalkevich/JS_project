import "./styles/styles.scss";
import {Router} from "./router.js";

export class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.routeChanging.bind(this));
        window.addEventListener('popstate', this.routeChanging.bind(this));
    }
    routeChanging() {
        this.router.activateRoute();
    }
}

(new App());