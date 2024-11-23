import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ProjectProvider } from "./Context/ProjectContext";

export default async function ProjectLayout({ params, children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = params;

  return (
    <div className="border-t px-8 py-6">
      <ProjectProvider id={id}>{children}</ProjectProvider>
    </div>
  );
}
