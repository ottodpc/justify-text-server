import {
  Router,
  Application,
  json,
  urlencoded,
  Response,
  Request,
} from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import Logger from "bunyan";
import "express-async-errors";
import bodyParser from "body-parser";
import nocache from "nocache";
import rateLimit from "express-rate-limit";
import connectTimeout from "connect-timeout";
import session from "express-session";
import lusca from "lusca";
import * as expressValidator from "express-validator";
import * as useragent from "express-useragent";
import morgan from "morgan";
import HTTP_STATUS from "http-status-codes";

import { LogSergice } from "./Logs";
import RouterSetting from "./Settings/index";
import { CustomError } from "./Helpers/index";
import express from "express";

class Server {
  private _app: Application;
  public get app(): Application {
    return this._app;
  }
  public set app(value: Application) {
    this._app = value;
  }

  routerInstance: Router;
  log: Logger;

  constructor(app: Application) {
    this.log = LogSergice.createLogger("Server");
    this._app = app;
    this.routerInstance = RouterSetting.getInstance();
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(nocache());
    app.use(helmet());
    app.enable("trust proxy");
    app.set("trust proxy", 1);
    app.use(hpp());
    app.use(helmet());

    const allowedOrigins = ["*"];

    app.use(
      cors({
        origin: "*",
        credentials: false,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );

    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
      })
    );

    app.use(
      session({
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
      })
    );

    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.hsts({ maxAge: 31536000 }));
    app.use(lusca.xssProtection(true));
    app.use(lusca.nosniff());
    app.use(lusca.referrerPolicy("same-origin"));

    app.use(connectTimeout("15s"));

    app.use(useragent.express());
  }

  private standardMiddleware(app: Application): void {
    app.use(compression({}));
    app.use(morgan("dev"));
    const payloadMaxSize = "10kb";

    app.use(json({ limit: payloadMaxSize }));
    app.use(
      urlencoded({
        extended: true,
        limit: payloadMaxSize,
      })
    );

    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: payloadMaxSize,
        parameterLimit: 100000000,
      })
    );
    app.use(expressValidator.body());
    app.use(express.text());
  }

  private routesMiddleware(app: Application): void {
    app.use(this.routerInstance);
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: `${req.originalUrl} We are sorry, just not found!` });
    });

    app.use((error: any, _req: any, res: any, next: any) => {
      this.log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    if (process.env.SECRET_KEY === undefined) {
      throw new Error("JWT TOKEN must be provided");
    }
    if (process.env.SESSION_SECRET === undefined) {
      throw new Error("SESSION SECRET must be provided");
    }
    try {
      this.log.info(
        `🚀 Worker with process id of ${process.pid} has started... 🚀`
      );
      this.log.info(`✨ Server has started with process ${process.pid}`);
      app.listen(process.env.PORT ?? 80, () => {
        this.log.info(`✅ Server running on port ${process.env.PORT ?? 80}`);
      });
    } catch (error) {
      this.log.error(error);
    }
  }
}

export default Server;
