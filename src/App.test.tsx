import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

const STORAGE_KEYS = ["ata-demo-customers", "ata-demo-orders", "ata-demo-tasks"];

function resetStorageAndHash() {
  for (const key of STORAGE_KEYS) window.localStorage.removeItem(key);
  history.replaceState(null, "", "#/");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

beforeEach(() => {
  resetStorageAndHash();
});

afterEach(() => {
  cleanup();
  resetStorageAndHash();
});

describe("App navigation", () => {
  it("renders the dashboard heading on the default route", () => {
    render(<App />);
    expect(screen.getByText("صبح بخیر، احسان")).toBeInTheDocument();
  });

  it("navigates to customers via the sidebar and updates the URL hash", () => {
    render(<App />);
    fireEvent.click(screen.getByText("مشتریان"));
    expect(window.location.hash).toBe("#/customers");
    expect(screen.getByText("فهرست مشتریان")).toBeInTheDocument();
  });

  it("navigates to orders and back to dashboard using browser back", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("سفارش‌ها"));
    expect(window.location.hash).toBe("#/orders");
    history.back();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(window.location.hash).toBe("#/");
  });

  it("opens a customer profile with a deep-linkable hash", () => {
    render(<App />);
    fireEvent.click(screen.getByText("مشتریان"));
    fireEvent.click(screen.getByText("صنایع آریا شرق"));
    expect(window.location.hash).toBe("#/customers/cus-101");
    expect(screen.getByText("پرونده مشتری")).toBeInTheDocument();
  });

  it("loads a customer profile directly from a deep link", () => {
    history.replaceState(null, "", "#/customers/cus-102");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    render(<App />);
    expect(screen.getByText("پارس تجهیز البرز")).toBeInTheDocument();
  });
});
