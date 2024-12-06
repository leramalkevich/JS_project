import "./styles/styles.scss";
import {Router} from "./router";

export class App {
    // private router: Router;
    constructor() {
        new Router();
        // this.router = new Router();
        // window.addEventListener('DOMContentLoaded', this.routeChanging.bind(this));
        // window.addEventListener('popstate', this.routeChanging.bind(this));
    }
    // public routeChanging():void {
        // this.router.activateRoute().then();
    // }
}

(new App());