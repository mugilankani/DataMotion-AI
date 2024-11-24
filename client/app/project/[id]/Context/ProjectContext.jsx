"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const projects = [
  {
    id: "987274981273",
    name: "Comparison on iPhone and Android in India",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Mason",
    status: "COMPLETED",
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
  {
    id: "987274981473",
    name: "Comparison on Windows and Linux in India",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Mason",
    status: "COMPLETED",
    prompt:
      "Create a graph showing Windows usage at 30% and Linux usage at 70% in India",
    inference: [
      {
        started: "2024-11-22T10:00:00Z",
        status: "COMPLETED",
        completed: "2024-11-22T10:06:00Z",
        prompt:
          "Create a graph showing Windows usage at 30% and Linux usage at 70% in India",
        video:
          "https://videos.pexels.com/video-files/7579579/7579579-sd_960_506_25fps.mp4",
      },
    ],
  },
];

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children, id }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch project details
  const fetchProject = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching project details for ID:", id);

      // Find the project matching the given ID
      const matchedProject = projects.find((p) => p.id === id);

      if (matchedProject) {
        setProject(matchedProject);
      } else {
        throw new Error("Project not found");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Automatically fetch project details when `id` changes
  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  return (
    <ProjectContext.Provider value={{ project, error, loading, fetchProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
