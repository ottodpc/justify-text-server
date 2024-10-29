import "es6-shim";
import "reflect-metadata";
import "dotenv/config";

import RouterSetting from "./Settings/index";
import AppplicationController from "./Controllers";
import Application from "./application";

AppplicationController.getInstance();

Application.getInstance({
  routerInstance: RouterSetting.getInstance(),
}).init();
