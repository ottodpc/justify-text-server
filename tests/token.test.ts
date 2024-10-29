import request from "supertest";
import express from "express";
import RouterSetting from "../src/Settings/index";
import AppplicationController from "../src/Controllers";
import Application from "../src/application";

AppplicationController.getInstance();

// @ts-ignore
const app: express.Application = Application.getInstance({
  routerInstance: RouterSetting.getInstance(),
}).init();

describe("Token API", () => {
  it("devrait retourner un token pour un email valide", async () => {
    const response = await request(app)
      .post("/api/token")
      .send({ email: "foo@bar.com" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("devrait retourner une erreur 400 pour un email invalide", async () => {
    const response = await request(app)
      .post("/api/token")
      .send({ email: "shakjajhnhbh999" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Une adresse email valide est requise"
    );
  });
});
