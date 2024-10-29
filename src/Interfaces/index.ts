import { Request, Response, NextFunction } from "express";

export enum MethodHttp {
  get = "get",
  post = "post",
  patch = "patch",
  delete = "delete",
  put = "put",
}

export enum MetadataKeys {
  method = "method",
  path = "path",
  middleware = "middleware",
  validator = "validator",
}

export interface ClassConstructor {
  new (...args: any[]): {};
}

export interface IRoute {
  method:
    | MethodHttp.get
    | MethodHttp.post
    | MethodHttp.put
    | MethodHttp.patch
    | MethodHttp.delete;
  path: string;
  middleware: (req: Request, res: Response, next: NextFunction) => void;
  controller: (req: Request, res: Response) => void;
}
