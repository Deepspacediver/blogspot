import { SignInState, SignUpState } from "@/lib/actions/auth.actions";

const defaultFormActionState = {
  message: "",
  error: null,
  details: "",
  fieldErrors: {},
};

export const defaultSignupState = {
  ...defaultFormActionState,
  prevFormState: { email: "", password: "", confirmPassword: "" },
} satisfies SignUpState;

export const defaultSignInState = {
  ...defaultFormActionState,
  prevFormState: { email: "", password: "" },
} satisfies SignInState;
