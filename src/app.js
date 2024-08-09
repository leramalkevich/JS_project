import "./styles/styles.scss";
import {Router} from "./router.js";

export class App {
    constructor() {
        this.router = new Router();
    }
}

(new App());