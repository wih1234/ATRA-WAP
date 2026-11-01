import { describe, expect, it } from "vitest";
import { demoCustomers } from "./crm-data";
import { findDuplicateCustomer, normalizeFormValues, validateCustomerForm, type CustomerFormValues } from "./customer-validation";

const validValues: CustomerFormValues = {
  name: "شرکت نمونه",
  contactName: "علی رضایی",
  phone: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
  email: "test@example.ir",
  industry: "تجهیزات",
  location: "تهران",
};

describe("normalizeFormValues", () => {
  it("trims whitespace from all fields", () => {
    const result = normalizeFormValues({
      name: "  شرکت  ",
      contactName: " علی ",
      phone: " 0912 ",
      email: " a@b.com ",
      industry: " صنعت ",
      location: " تهران ",
    });
    expect(result).toEqual({
      name: "شرکت",
      contactName: "علی",
      phone: "0912",
      email: "a@b.com",
      industry: "صنعت",
      location: "تهران",
    });
  });
});

describe("validateCustomerForm", () => {
  it("returns no errors for valid values", () => {
    expect(validateCustomerForm(validValues)).toEqual({});
  });

  it("reports missing required fields", () => {
    const errors = validateCustomerForm({
      name: "  ",
      contactName: "",
      phone: "",
      email: "",
      industry: "",
      location: "",
    });
    expect(errors.name).toBeDefined();
    expect(errors.contactName).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.industry).toBeDefined();
    expect(errors.location).toBeDefined();
  });

  it("rejects malformed email", () => {
    const errors = validateCustomerForm({ ...validValues, email: "not-an-email" });
    expect(errors.email).toBeDefined();
  });

  it("accepts a well-formed email", () => {
    const errors = validateCustomerForm({ ...validValues, email: "name@example.ir" });
    expect(errors.email).toBeUndefined();
  });

  it("rejects a phone that is too short", () => {
    const errors = validateCustomerForm({ ...validValues, phone: "۱۲" });
    expect(errors.phone).toBeDefined();
  });
});

describe("findDuplicateCustomer", () => {
  it("detects duplicate by name (case-insensitive, whitespace-normalized)", () => {
    const match = findDuplicateCustomer(
      { ...validValues, name: "  صنایع آریا شرق  " },
      demoCustomers,
    );
    expect(match).not.toBeNull();
    expect(match!.field).toBe("name");
    expect(match!.existing.id).toBe("cus-101");
  });

  it("detects duplicate by phone", () => {
    const match = findDuplicateCustomer(
      { ...validValues, name: "نام جدید", phone: "۰۹۱۲ ۳۴۵ ۷۸۹۰" },
      demoCustomers,
    );
    expect(match).not.toBeNull();
    expect(match!.field).toBe("phone");
  });

  it("detects duplicate by email (case-insensitive)", () => {
    const match = findDuplicateCustomer(
      { ...validValues, name: "نام جدید", phone: "۰۹۹۹ ۹۹۹ ۹۹۹۹", email: "H.MAHMOUDI@example.ir" },
      demoCustomers,
    );
    expect(match).not.toBeNull();
    expect(match!.field).toBe("email");
  });

  it("excludes the customer being edited", () => {
    const match = findDuplicateCustomer(
      { ...validValues, name: "صنایع آریا شرق" },
      demoCustomers,
      "cus-101",
    );
    expect(match).toBeNull();
  });

  it("returns null for a genuinely new customer", () => {
    const match = findDuplicateCustomer(
      { ...validValues, name: "شرکت کاملاً جدید", phone: "۰۹۹۹ ۱۲۳ ۴۵۶۷", email: "new@example.ir" },
      demoCustomers,
    );
    expect(match).toBeNull();
  });
});
