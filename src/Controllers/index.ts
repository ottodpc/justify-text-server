import { Request, Response } from "express";
import { POST } from "../Decorators/route.decorator";
import jwt from "jsonwebtoken";
import { Controller } from "../Decorators/controller.decorator";
import { TimitWordList } from "../Decorators/timit-words";

const isValideEmail = (email: string) =>
  email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

/**
 * Justifie une ligne en ajoutant des espaces entre les mots pour atteindre 80 caractères.
 * @param WordList - Les mots de la ligne
 * @param lineLength - La longueur actuelle de la ligne sans espaces
 * @returns La ligne justifiée
 */
const justifyLine = (WordList: string[], lineLength: number): string => {
  let spacesToAdd = 80 - lineLength;
  let i = 0;

  while (spacesToAdd > 0 && WordList.length > 1) {
    WordList[i] += " ";
    spacesToAdd--;
    i = (i + 1) % (WordList.length - 1);
  }

  return WordList.join(" ");
};
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

  // @ts-ignore
  @POST("/justify")
  @TimitWordList()
  async justifyText(req: Request, res: Response) {
    try {
      const text = req.body as string;

      if (!text || typeof text !== "string") {
        return res.status(400).json({
          message: "Le texte fourni doit être une chaîne de caractères",
        });
      }

      const WordList = text.split(" ");
      const lines: string[] = [];
      let currentLine: string[] = [];
      let currentLineLength = 0;

      for (const word of WordList) {
        if (currentLineLength + word.length + currentLine.length > 80) {
          lines.push(justifyLine(currentLine, currentLineLength));
          currentLine = [];
          currentLineLength = 0;
        }

        currentLine.push(word);
        currentLineLength += word.length;
      }

      if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
      }

      return res.type("text/plain").send(lines.join("\n"));
    } catch (error) {
      console.error(`🛑 error justifyText()`, error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  }
}

export default AppplicationController;
