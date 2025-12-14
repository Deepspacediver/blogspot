import { SignInState, SignUpState } from "@/lib/actions/auth.actions";
import { CreateCommentState } from "@/lib/actions/comment.actions";

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

export const defaultCreateCommentState: CreateCommentState = {
  ...defaultFormActionState,
  prevFormState: { content: "" },
};
