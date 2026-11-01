import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, fireEvent, within } from "@testing-library/react";
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
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("مشتریان"));
    expect(window.location.hash).toBe("#/customers");
    expect(screen.getByText("فهرست مشتریان")).toBeInTheDocument();
  });

  it("navigates to orders and back to dashboard using browser back", async () => {
    render(<App />);
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("سفارش‌ها"));
    expect(window.location.hash).toBe("#/orders");
    // jsdom does not synchronously resolve history.back() for hash navigation,
    // so simulate the resulting popstate that the browser would dispatch.
    history.replaceState(null, "", "#/");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(window.location.hash).toBe("#/");
  });

  it("opens a customer profile with a deep-linkable hash", () => {
    render(<App />);
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("مشتریان"));
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

describe("Customers page", () => {
  function goToCustomers() {
    render(<App />);
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("مشتریان"));
  }

  it("searches customers by name", () => {
    goToCustomers();
    const input = screen.getByPlaceholderText("جست‌وجو در نام، رابط یا شماره تماس...");
    fireEvent.change(input, { target: { value: "پارس" } });
    expect(screen.getByText("پارس تجهیز البرز")).toBeInTheDocument();
    expect(screen.queryByText("صنایع آریا شرق")).not.toBeInTheDocument();
  });

  it("filters customers by type", () => {
    goToCustomers();
    const select = screen.getByDisplayValue("همه");
    fireEvent.change(select, { target: { value: "حقیقی" } });
    expect(screen.getByText("فروشگاه باتری نیرو")).toBeInTheDocument();
    expect(screen.queryByText("صنایع آریا شرق")).not.toBeInTheDocument();
  });

  it("shows a no-results message when search has no matches", () => {
    goToCustomers();
    const input = screen.getByPlaceholderText("جست‌وجو در نام، رابط یا شماره تماس...");
    fireEvent.change(input, { target: { value: "zzzznonexistent" } });
    expect(screen.getByText("مشتری‌ای پیدا نشد")).toBeInTheDocument();
  });
});

describe("Customer form validation", () => {
  function openCreateForm() {
    render(<App />);
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("مشتریان"));
    fireEvent.click(screen.getByText("ثبت مشتری جدید"));
  }

  it("shows inline errors for empty required fields", () => {
    openCreateForm();
    fireEvent.click(screen.getByText("ثبت مشتری"));
    expect(screen.getByText("نام مشتری الزامی است.")).toBeInTheDocument();
    expect(screen.getByText("شماره تماس الزامی است.")).toBeInTheDocument();
    expect(screen.getByText("ایمیل الزامی است.")).toBeInTheDocument();
  });

  it("rejects an invalid email format", () => {
    openCreateForm();
    fireEvent.change(screen.getByPlaceholderText("مثلاً شرکت نمونه ایرانیان"), { target: { value: "شرکت جدید" } });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), { target: { value: "علی رضایی" } });
    fireEvent.change(screen.getByPlaceholderText("تجهیزات صنعتی"), { target: { value: "صنعت" } });
    fireEvent.change(screen.getByPlaceholderText("۰۹۱۲ ۰۰۰ ۰۰۰۰"), { target: { value: "۰۹۱۲ ۱۱۱ ۱۱۱۱" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.ir"), { target: { value: "bad-email" } });
    fireEvent.change(screen.getByPlaceholderText("استان، شهر، نشانی کوتاه"), { target: { value: "تهران" } });
    fireEvent.click(screen.getByText("ثبت مشتری"));
    expect(screen.getByText("فرمت ایمیل صحیح نیست.")).toBeInTheDocument();
  });

  it("warns about a duplicate customer and blocks save", () => {
    openCreateForm();
    fireEvent.change(screen.getByPlaceholderText("مثلاً شرکت نمونه ایرانیان"), { target: { value: "صنایع آریا شرق" } });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), { target: { value: "علی رضایی" } });
    fireEvent.change(screen.getByPlaceholderText("تجهیزات صنعتی"), { target: { value: "تجهیزات" } });
    fireEvent.change(screen.getByPlaceholderText("۰۹۱۲ ۰۰۰ ۰۰۰۰"), { target: { value: "۰۹۱۲ ۳۴۵ ۷۸۹۰" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.ir"), { target: { value: "dup@example.ir" } });
    fireEvent.change(screen.getByPlaceholderText("استان، شهر، نشانی کوتاه"), { target: { value: "تهران" } });
    fireEvent.click(screen.getByText("ثبت مشتری"));
    expect(screen.getByText(/مشتری مشابه با نام «صنایع آریا شرق»/)).toBeInTheDocument();
  });

  it("creates a new valid customer and navigates to its profile", () => {
    openCreateForm();
    fireEvent.change(screen.getByPlaceholderText("مثلاً شرکت نمونه ایرانیان"), { target: { value: "شرکت تست پارس" } });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), { target: { value: "علی رضایی" } });
    fireEvent.change(screen.getByPlaceholderText("تجهیزات صنعتی"), { target: { value: "صنعت" } });
    fireEvent.change(screen.getByPlaceholderText("۰۹۱۲ ۰۰۰ ۰۰۰۰"), { target: { value: "۰۹۹۹ ۱۲۳ ۴۵۶۷" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.ir"), { target: { value: "test@example.ir" } });
    fireEvent.change(screen.getByPlaceholderText("استان، شهر، نشانی کوتاه"), { target: { value: "تهران" } });
    fireEvent.click(screen.getByText("ثبت مشتری"));
    expect(screen.getByText("پرونده مشتری")).toBeInTheDocument();
    expect(screen.getByText("شرکت تست پارس")).toBeInTheDocument();
  });

  it("edits an existing customer without duplicate warning", () => {
    render(<App />);
    const sidebar = screen.getByRole("navigation", { name: "ناوبری کناری" });
    fireEvent.click(within(sidebar).getByText("مشتریان"));
    fireEvent.click(screen.getByText("پارس تجهیز البرز"));
    fireEvent.click(screen.getByText("ویرایش"));
    const nameInput = screen.getByPlaceholderText("مثلاً شرکت نمونه ایرانیان");
    fireEvent.change(nameInput, { target: { value: "پارس تجهیز البرز به‌روزرسانی" } });
    fireEvent.click(screen.getByText("ذخیره تغییرات"));
    expect(screen.getByText("پارس تجهیز البرز به‌روزرسانی")).toBeInTheDocument();
  });
});
