import "es6-shim";
import "reflect-metadata";
import "dotenv/config";
import express, { Express, Router } from "express";
import Logger from "bunyan";

import { LogSergice } from "./Logs";
import Server from "./server";
import RouterSetting from "./Settings/index";
import AppplicationController from "./Controllers";

class Application {
  private static _instance: Application;
  static log: Logger = LogSergice.createLogger("Application");

  private constructor() {
    if (Application._instance) {
      throw new Error("🛑 Application already exists");
    } else {
      Application._instance = this;
    }
  }
  public static getInstance({
    routerInstance,
  }: {
    routerInstance: Router;
  }): Application {
    if (!Application._instance) {
      Application._instance = new Application();
    }
    return Application._instance;
  }

  public init(): void {
    const app: Express = express();

    const server: Server = new Server(app);
    server.start();
    Application.handleExit();
  }

  private static handleExit(): void {
    process.on("uncaughtException", (error: Error) => {
      this.log.error(`🛑 There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on("unhandleRejection", (reason: Error) => {
      this.log.error(`🛑 Unhandled rejection at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      this.log.error("🛑 Caught SIGTERM");
      Application.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      this.log.error("🛑 Caught SIGINT");
      Application.shutDownProperly(2);
    });

    process.on("exit", () => {
      this.log.error("🛑 Exiting");
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        this.log.info("🛑 Shutdown complete");
        process.exit(exitCode);
      })
      .catch((error) => {
        this.log.error(`🛑 Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

AppplicationController.getInstance();

Application.getInstance({
  routerInstance: RouterSetting.getInstance(),
}).init();
