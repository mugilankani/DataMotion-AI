"use Client";

import Link from "next/link";
import { redirect } from "next/navigation";

import clsx from "clsx";

import { auth } from "@/lib/auth";
import DashboardInput from "@/components/dashboard-input";

import InteractivePieChart from "./Graph";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) redirect("/");

  const projects = [
    {
      id: "987274981273",
      name: "Comparison on iPhone and Android in India",
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Mason",
      status: "COMPLETED",
      prompt:
        "Create a graph showing iPhone usage at 30% and Android usage at 70% in India",
    },
    {
      id: "987274981473",
      name: "Comparison on windows and linux in India",
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Mason",
      status: "COMPLETED",
      prompt:
        "Create a graph showing windows usage at 30% and linux usage at 70% in India",
    },
  ];

  return (
    <div className="border-t px-8 py-2">
      <div className="py-4 pb-6">
        <div className="flex w-full flex-col items-center justify-center gap-8 overflow-hidden py-16">
          <h1 className="text-4xl font-bold">
            What info graphic video <br /> do you want to create?
          </h1>

          <DashboardInput />
        </div>
      </div>
      <hr />
      <h1 className="col-span-3 mb-1 mt-4 font-sans text-2xl font-semibold">
        Your Projects
      </h1>
      <div className="grid grid-cols-1 gap-3 py-3 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              href={`/project/${project.id}`}
              className="group flex w-full flex-col gap-2.5 border bg-white p-4 text-black hover:cursor-pointer hover:border-gray-300"
              key={project.id}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-8 w-8 rounded-full bg-gray-50 group-hover:bg-white"
                  src={project.avatar}
                  alt={project.name}
                />
                <span className="line-clamp-2 text-sm font-medium leading-4">
                  {project.name}
                </span>
                <span
                  className={clsx(
                    "ml-auto h-fit w-fit px-2 py-0.5 text-xs font-medium",
                    project.status === "COMPLETED" &&
                      "border border-emerald-200 bg-emerald-50 text-emerald-500",
                    project.status === "RENDERING" &&
                      "border border-yellow-200 bg-yellow-50 text-yellow-500",
                  )}
                >
                  {project.status}
                </span>
              </div>
              <hr className="my-1 border-gray-200" />
              <div>
                <img
                  src="https://marketplace.canva.com/EAFb-j5b1eE/1/0/1600w/canva-beige-modern-product-sales-bar-chart-graph-ETTe6RDcUd0.jpg"
                  className="aspect-video"
                  alt=""
                />
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-3 border p-4 text-sm font-medium text-gray-600">
            You have no projects yet. Create a new project to get started.
          </p>
        )}
      </div>
      <InteractivePieChart />
    </div>
  );
}
