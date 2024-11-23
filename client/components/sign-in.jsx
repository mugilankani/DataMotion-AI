"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      className="bg-black px-3 py-1 text-sm font-medium text-white"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
}
