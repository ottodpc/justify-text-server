import express from "express";

class RouterSetting {
  private static instance: express.Router;

  static getInstance(): express.Router {
    if (!RouterSetting.instance) {
      RouterSetting.instance = express.Router();
    }

    return RouterSetting.instance;
  }
}
export default RouterSetting;
