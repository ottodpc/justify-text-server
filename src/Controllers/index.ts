import { Request, Response } from "express";
import { POST } from "../Decorators/route.decorator";
import jwt from "jsonwebtoken";
import { Controller } from "../Decorators/controller.decorator";

const isValideEmail = (email: string) =>
  email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
@Controller(`/api`)
// @ts-ignore
class AppplicationController {
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
      const result = isValideEmail(email);
      if (!email || typeof email !== "string" || !result) {
        return res
          .status(400)
          .json({ message: "Une adresse email valide est requise" });
      } else {
        return res.status(200).json({
          token: jwt.sign({ email }, String(process.env.SECRET_KEY), {
            expiresIn: "1d",
          }),
        });
      }
    } catch (error) {
      console.error(`🛑 error getUserToken() error`, error);
    }
  }
}

export default AppplicationController;
