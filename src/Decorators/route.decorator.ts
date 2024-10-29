import "reflect-metadata";
import { RequestHandler } from "express";
import { MethodHttp, MetadataKeys } from "../Interfaces";

interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

function routeFunction(method: string) {
  return function (path: string) {
    return function (target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}

export const GET = routeFunction(MethodHttp.get);
export const PUT = routeFunction(MethodHttp.put);
export const POST = routeFunction(MethodHttp.post);
export const DELETE = routeFunction(MethodHttp.delete);
export const PATCH = routeFunction(MethodHttp.patch);
