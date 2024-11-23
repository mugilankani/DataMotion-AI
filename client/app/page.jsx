import { Pacifico } from "next/font/google";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignIn from "@/components/sign-in";

const pacifico = Pacifico({
  weight: "400",
  display: "swap",
});

export default async function Home() {
  const session = await auth();

  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center p-4 py-20">
      <div>
        <h1 className="relative text-center text-4xl font-bold">
          <span className="z-40">
            Turn your data into stunning <br />
          </span>
          <span
            className={`font-pacifico -z-20 animate-gradient bg-gradient-to-r from-violet-400 via-red-300 to-violet-400 bg-200% bg-clip-text text-5xl font-bold leading-none text-transparent ${pacifico.className}`}
          >
            info-graphic videos
          </span>{" "}
        </h1>
        <div className="mt-8 flex items-center justify-center gap-2">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
