import { describe, expect, it } from "vitest";
import { parseHash, toHash } from "./router";

describe("parseHash", () => {
  it("maps empty hash to dashboard", () => {
    expect(parseHash("")).toEqual({ name: "dashboard" });
    expect(parseHash("#")).toEqual({ name: "dashboard" });
    expect(parseHash("#/")).toEqual({ name: "dashboard" });
  });

  it("maps #/customers to customers list", () => {
    expect(parseHash("#/customers")).toEqual({ name: "customers" });
  });

  it("maps #/customers/<id> to a customer profile", () => {
    expect(parseHash("#/customers/cus-101")).toEqual({
      name: "customer",
      customerId: "cus-101",
    });
  });

  it("decodes percent-encoded customer ids", () => {
    expect(parseHash("#/customers/cus%20101")).toEqual({
      name: "customer",
      customerId: "cus 101",
    });
  });

  it("maps orders, tasks and assistant", () => {
    expect(parseHash("#/orders")).toEqual({ name: "orders" });
    expect(parseHash("#/tasks")).toEqual({ name: "tasks" });
    expect(parseHash("#/assistant")).toEqual({ name: "assistant" });
  });

  it("falls back to dashboard for unknown routes", () => {
    expect(parseHash("#/unknown")).toEqual({ name: "dashboard" });
    expect(parseHash("#/foo/bar")).toEqual({ name: "dashboard" });
  });
});

describe("toHash", () => {
  it("produces stable hashes for each route", () => {
    expect(toHash({ name: "dashboard" })).toBe("#/");
    expect(toHash({ name: "customers" })).toBe("#/customers");
    expect(toHash({ name: "customer", customerId: "cus-101" })).toBe(
      "#/customers/cus-101",
    );
    expect(toHash({ name: "orders" })).toBe("#/orders");
    expect(toHash({ name: "tasks" })).toBe("#/tasks");
    expect(toHash({ name: "assistant" })).toBe("#/assistant");
  });

  it("percent-encodes customer ids with special characters", () => {
    expect(toHash({ name: "customer", customerId: "cus 101" })).toBe(
      "#/customers/cus%20101",
    );
  });

  it("round-trips through parseHash", () => {
    const cases = [
      { name: "dashboard" },
      { name: "customers" },
      { name: "customer", customerId: "cus-101" },
      { name: "customer", customerId: "cus 101" },
      { name: "orders" },
      { name: "tasks" },
      { name: "assistant" },
    ] as const;
    for (const route of cases) {
      expect(parseHash(toHash(route))).toEqual(route);
    }
  });
});
