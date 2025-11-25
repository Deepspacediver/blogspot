import Link from "next/link";

export function AuthButtons() {
  return (
    <div>
      <Link href={"/auth/signin"}>Sign in</Link>
      <Link href={"/auth/signup"}>Sign up</Link>
    </div>
  );
}
