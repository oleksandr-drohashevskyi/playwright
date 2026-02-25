import { test, expect, request } from "@playwright/test";
import { getEnv } from "../utils/env.js";

test.describe("API /api/cars (APIRequestContext)", () => {
  test("POST /api/cars - positive", async () => {
    const env = getEnv();

    const api = await request.newContext({
      baseURL: env.BASE_URL,
      httpCredentials: {
        username: String(env.HTTP_USER),
        password: String(env.HTTP_PASS),
      },
      storageState: ".auth/user.json",
    });

    const payload = {
      carBrandId: 1, 
      carModelId: 1, 
      mileage: 123,
    };

    const res = await api.post("/api/cars", { data: payload });
    expect(res.status(), await res.text()).toBe(201);

    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.data).toMatchObject({
      carBrandId: payload.carBrandId,
      carModelId: payload.carModelId,
      mileage: payload.mileage,
    });

    await api.dispose();
  });

  test("POST /api/cars - negative: missing required field (mileage)", async () => {
    const env = getEnv();

    const api = await request.newContext({
      baseURL: env.BASE_URL,
      httpCredentials: {
        username: String(env.HTTP_USER),
        password: String(env.HTTP_PASS),
      },
      storageState: ".auth/user.json",
    });

    const payload = {
      carBrandId: 1,
      carModelId: 1,
      // mileage отсутствует
    };

    const res = await api.post("/api/cars", { data: payload });
    expect(res.status()).toBe(400);

    await api.dispose();
  });

  test("POST /api/cars - negative: invalid mileage (string)", async () => {
    const env = getEnv();

    const api = await request.newContext({
      baseURL: env.BASE_URL,
      httpCredentials: {
        username: String(env.HTTP_USER),
        password: String(env.HTTP_PASS),
      },
      storageState: ".auth/user.json",
    });

    const payload = {
      carBrandId: 1,
      carModelId: 1,
      mileage: "abc",
    };

    const res = await api.post("/api/cars", { data: payload });
    expect([400, 422]).toContain(res.status()); 

    await api.dispose();
  });
});