import "./styles/styles.scss";
import {Router} from "./router";

export class App {
    private router: Router;
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.routeChanging.bind(this));
        window.addEventListener('popstate', this.routeChanging.bind(this));
    }
    public routeChanging():void {
        this.router.openNewRoute().then();
    }
}

(new App());