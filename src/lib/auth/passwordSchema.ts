import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;

export type PasswordSchemaMessages = {
  requirement: string;
  maxLength: string;
};

/** Mirrors backend `RegisterRequest` / `ResetPasswordRequest` password rules. */
export function createPasswordFieldSchema(msgs: PasswordSchemaMessages) {
  return z
    .string()
    .min(6, msgs.requirement)
    .max(30, msgs.maxLength)
    .regex(PASSWORD_REGEX, msgs.requirement);
}
