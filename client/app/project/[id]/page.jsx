"use client";

import { useState } from "react";

import clsx from "clsx";
import { toast } from "sonner";

const projects = [
  {
    id: "987274981273",
    name: "Comparison on iPhone and Android in India",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Mason",
    status: "COMPLETED",
    repoLink: "https://github.com/username/ai-assistant",
    prompt:
      "Create a graph showing iPhone usage at 30% and Android usage at 70% in India",
    inference: [
      {
        started: "2024-11-20T10:00:00Z",
        status: "COMPLETED",
        completed: "2024-11-20T10:05:00Z",
        prompt:
          "Create a graph showing iPhone usage at 30% and Android usage at 70% in India",
        video:
          "https://videos.pexels.com/video-files/7579577/7579577-sd_960_506_25fps.mp4",
      },
      {
        started: "2024-11-21T14:00:00Z",
        status: "COMPLETED",
        completed: "2024-11-21T14:07:00Z",
        prompt:
          "Update the graph to show iPhone usage at 35% and Android usage at 65% in India",
        video:
          "https://videos.pexels.com/video-files/7579578/7579578-sd_960_506_25fps.mp4",
      },
    ],
  },
];

export default function Project() {
  const [generating, setGenerating] = useState(false);
  const [projectData, setProjectData] = useState(projects[0]); // Assuming you're displaying the first project

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(data);
    toast.info("Copied to clipboard!", { duration: 1000 });
  };

  const handleRecreate = () => {
    const latestInference =
      projectData.inference[projectData.inference.length - 1];
    const newPrompt = prompt(
      "Edit the prompt for the new inference:",
      latestInference.prompt,
    );

    if (newPrompt) {
      setGenerating(true);

      // Simulate a delay for 10 seconds to show "Generating"
      setTimeout(() => {
        // Add the new inference after 10 seconds
        const newInference = {
          started: new Date().toISOString(),
          status: "COMPLETED",
          completed: new Date(new Date().getTime() + 10 * 1000).toISOString(),
          prompt: newPrompt,
          video:
            "https://videos.pexels.com/video-files/7579579/7579579-sd_960_506_25fps.mp4", // Placeholder video
        };

        setProjectData((prev) => ({
          ...prev,
          inference: [newInference, ...prev.inference],
        }));

        setGenerating(false);
        toast.success("Inference generated successfully!");
      }, 10000);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-6 border-gray-300">
        <div className="flex items-center gap-4">
          <img
            className="h-10 w-10 rounded-full"
            src={projectData.avatar}
            alt={`${projectData.name} avatar`}
          />
          <div className="flex flex-col">
            <p className="font-medium">{projectData.name}</p>
            <span className="text-xs text-gray-500">#{projectData.id}</span>
          </div>
          <button
            onClick={handleRecreate}
            className="ml-auto bg-black px-4 py-1.5 text-white"
          >
            Recreate
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {generating && (
            <div className="flex flex-col gap-4 border border-gray-300 p-4 outline outline-2 outline-gray-100">
              <p>Generating...</p>
            </div>
          )}
          {projectData.inference.map((inf, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 border border-gray-300 p-4 outline outline-2 outline-gray-100"
            >
              <video
                className="h-64 border"
                src={inf.video}
                controls
                alt={`Inference video ${index + 1}`}
              ></video>
              <div>
                <div className="mb-3">
                  <p className="mb-1 font-mono font-semibold">Prompt</p>
                  <div className="flex w-full items-center gap-2">
                    <p className="line-clamp-1 items-center justify-center rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-sans text-sm text-gray-700 shadow-inner hover:cursor-pointer hover:bg-gray-100">
                      {inf.prompt}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 cursor-pointer items-center justify-center rounded border border-gray-200 p-1 text-black shadow-inner hover:bg-gray-50"
                      onClick={() => copyToClipboard(inf.prompt)}
                    >
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v4" />
                      <path d="M21 14H11" />
                      <path d="m15 10-4 4 4 4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-mono font-semibold">Status</p>
                  <span
                    className={clsx(
                      "ml-auto h-fit w-fit px-2 py-0.5 text-xs font-medium",
                      inf.status === "COMPLETED" &&
                        "border border-emerald-200 bg-emerald-50 text-emerald-500",
                      inf.status === "RENDERING" &&
                        "border border-yellow-200 bg-yellow-50 text-yellow-500",
                    )}
                  >
                    {inf.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
