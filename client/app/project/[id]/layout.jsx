import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ProjectProvider } from "./Context/ProjectContext";

export default async function ProjectLayout(props) {
  const params = await props.params;
  const { id } = params;

  const { children } = props;

  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="border-t px-8 py-6">
      <ProjectProvider id={id}>{children}</ProjectProvider>
    </div>
  );
}
