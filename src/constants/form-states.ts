import { SignUpState } from "@/lib/actions/auth.actions";

export const defaultSignupState = {
  message: "",
  fieldErrors: {},
  prevFormState: { email: "", password: "", confirmPassword: "" },
} satisfies SignUpState;
