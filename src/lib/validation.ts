import { z } from "zod";

import type { Profile } from "@/lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+([/?#].*)?$/i;

type FieldErrors<T extends string> = Partial<Record<T, string>>;

const textField = (maxLength: number) =>
  z.string().trim().max(maxLength, "Too long");

const optionalEmail = z
  .string()
  .trim()
  .max(254, "Email is too long")
  .refine((value) => !value || emailPattern.test(value), "Invalid email");

const optionalWebsite = z
  .string()
  .trim()
  .max(2048, "Website is too long")
  .refine((value) => !value || websitePattern.test(value), "Invalid URL");

const optionalPhone = z
  .string()
  .trim()
  .max(24, "Phone is too long")
  .refine(
    (value) => !value || value.replace(/\D/g, "").length >= 7,
    "Invalid phone number",
  );

const profileSchema = z.object({
  id: z.string(),
  name: textField(120),
  firstName: textField(80),
  lastName: textField(80),
  company: textField(120),
  title: textField(120),
  mobile: optionalPhone,
  workPhone: optionalPhone,
  fax: optionalPhone,
  email: optionalEmail,
  website: optionalWebsite,
  street: textField(160),
  city: textField(80),
  state: textField(80),
  zip: textField(20),
  country: textField(80),
  updatedAt: z.number(),
});

const onboardingSchema = z.object({
  firstName: textField(80),
  lastName: textField(80),
  email: optionalEmail,
  mobile: optionalPhone,
});

function issuesToFieldErrors<T extends string>(issues: z.ZodIssue[]) {
  const errors: FieldErrors<T> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key as T]) {
      errors[key as T] = issue.message;
    }
  }

  return errors;
}

export function validateProfileInput(profile: Profile) {
  const result = profileSchema.safeParse(profile);

  if (result.success) {
    return {
      ok: true as const,
      data: result.data,
      errors: {} as FieldErrors<keyof Profile>,
    };
  }

  return {
    ok: false as const,
    errors: issuesToFieldErrors<keyof Profile>(result.error.issues),
  };
}

export function validateOnboardingInput(input: {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}) {
  const result = onboardingSchema.safeParse(input);

  if (result.success) {
    return {
      ok: true as const,
      data: result.data,
      errors: {} as FieldErrors<"firstName" | "lastName" | "email" | "mobile">,
    };
  }

  return {
    ok: false as const,
    errors: issuesToFieldErrors<"firstName" | "lastName" | "email" | "mobile">(
      result.error.issues,
    ),
  };
}