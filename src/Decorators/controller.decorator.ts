import "reflect-metadata";
import { BodyValidators } from "./body-validator.decorator";
import RouterSetting from "../Settings/index";
import { MetadataKeys, MethodHttp } from "../Interfaces/index";

export function Controller(routePrefix2: string) {
  return function (target: Function) {
    const routerInstance = RouterSetting.getInstance();

    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];

      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );

      const method: MethodHttp = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      const requiredBodyProps =
        Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) ||
        [];

      const validator = BodyValidators(requiredBodyProps);

      if (path) {
        let route = `${routePrefix2}${path}`;
        // @ts-ignore
        routerInstance[method](route, ...middlewares, validator, routeHandler);
      }
    }
  };
}
