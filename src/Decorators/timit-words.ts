import { Request, Response, NextFunction } from "express";

const dailyWordLimit = 80000;
const rateLimit = new Map<string, { count: number; date: Date }>();

export function TimitWordList() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const token = req.headers["authorization"];
      if (!token) return res.status(403).json({ message: "Token requis" });

      // Validation de req.body
      if (typeof req.body !== "string") {
        return res.status(400).json({
          message: "Le texte fourni doit être une chaîne de caractères",
        });
      }

      const wordCount = req.body.split(" ").length;
      const limitInfo = rateLimit.get(token) || { count: 0, date: new Date() };

      if (limitInfo.date.getDate() !== new Date().getDate()) {
        rateLimit.set(token, { count: wordCount, date: new Date() });
      } else if (limitInfo.count + wordCount > dailyWordLimit) {
        return res.status(402).json({ message: "Limite de mots atteinte" });
      } else {
        rateLimit.set(token, {
          count: limitInfo.count + wordCount,
          date: limitInfo.date,
        });
      }

      originalMethod.apply(this, [req, res, next]);
    };
  };
}
