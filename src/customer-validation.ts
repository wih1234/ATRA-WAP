import type { Customer } from "./crm-data";

export type CustomerFormValues = {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  industry: string;
  location: string;
};

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeFormValues(values: CustomerFormValues): CustomerFormValues {
  return {
    name: values.name.trim(),
    contactName: values.contactName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    industry: values.industry.trim(),
    location: values.location.trim(),
  };
}

export function validateCustomerForm(values: CustomerFormValues): CustomerFormErrors {
  const errors: CustomerFormErrors = {};
  const normalized = normalizeFormValues(values);

  if (!normalized.name) errors.name = "نام مشتری الزامی است.";
  if (!normalized.contactName) errors.contactName = "نام رابط الزامی است.";
  if (!normalized.industry) errors.industry = "حوزه فعالیت الزامی است.";
  if (!normalized.location) errors.location = "نشانی الزامی است.";

  if (!normalized.phone) {
    errors.phone = "شماره تماس الزامی است.";
  } else {
    const digits = normalized.phone.replace(/[^\d۰-۹]/g, "");
    if (digits.length < 4) errors.phone = "شماره تماس معتبر نیست.";
  }

  if (!normalized.email) {
    errors.email = "ایمیل الزامی است.";
  } else if (!EMAIL_RE.test(normalized.email)) {
    errors.email = "فرمت ایمیل صحیح نیست.";
  }

  return errors;
}

export type DuplicateMatch = {
  field: "name" | "phone" | "email";
  existing: Customer;
};

export function findDuplicateCustomer(
  values: CustomerFormValues,
  customers: Customer[],
  excludeId?: string,
): DuplicateMatch | null {
  const normalized = normalizeFormValues(values);
  const lower = (s: string) => s.toLowerCase().replace(/\s+/g, " ");
  for (const customer of customers) {
    if (customer.id === excludeId) continue;
    if (lower(customer.name) === lower(normalized.name)) {
      return { field: "name", existing: customer };
    }
    if (normalized.phone && customer.phone.replace(/\s+/g, "") === normalized.phone.replace(/\s+/g, "")) {
      return { field: "phone", existing: customer };
    }
    if (normalized.email && lower(customer.email) === lower(normalized.email)) {
      return { field: "email", existing: customer };
    }
  }
  return null;
}
