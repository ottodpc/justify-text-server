import { Request, Response, NextFunction } from "express";
import { MetadataKeys } from "../Interfaces/index";

export function DefineBodyValidator(...keys: string[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
  };
}

export function BodyValidators(keys: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const messageHandle = (keys: string[]) => {
      let message: string = "";
      keys.map((key) => {
        if (!req.body[key]) {
          message = message + `Missing property ${key}, `;
        }
      });
      return message;
    };
    for (let key of keys) {
      if (!req.body[key]) {
        let message = messageHandle(keys);
        return res.status(200).send(message);
      }
    }
    next();
  };
}

export declare function Body(): (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => void;
