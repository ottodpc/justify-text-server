import { Request, Response } from "express";
import Logger from "bunyan";
import { POST } from "../Decorators/route.decorator";
import { LogSergice } from "../Logs/index";
import jwt from "jsonwebtoken";
import { Controller } from "../Decorators/controller.decorator";

@Controller(`/api`)
// @ts-ignore
class AppplicationController {
  private log: Logger = LogSergice.createLogger(`BaseController `);
  private static instance: AppplicationController;
  private constructor() {
    if (AppplicationController.instance) {
      throw new Error("Appplication Controller already exists");
    } else {
      AppplicationController.instance = this;
    }
  }

  public static getInstance(): AppplicationController {
    if (!AppplicationController.instance) {
      AppplicationController.instance = new AppplicationController();
    }
    return AppplicationController.instance;
  }

  // @ts-ignore
  @POST("/token")
  async getUserToken(req: Request, res: Response) {
    try {
      const { email } = req.body;
      console.log("getUserToken() req.body", req.body);
      const token = jwt.sign({ email }, String(process.env.SECRET_KEY), {
        expiresIn: "1d",
      });
      return res.status(200).json({ token });
    } catch (error) {
      this.log.error(`🛑 getUserToken() error`, error);
    }
  }
}

export default AppplicationController;
