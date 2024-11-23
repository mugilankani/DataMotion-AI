import Link from "next/link";

import { auth } from "@/lib/auth";

import ProfileMenu from "./profile-menu";
import SignIn from "./sign-in";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4">
      <Link
        href={session ? "/dashboard" : "/"}
        className="text-xl font-bold tracking-tight"
      >
        DataMotion AI
      </Link>
      {session ? <ProfileMenu /> : <SignIn />}
    </nav>
  );
}
