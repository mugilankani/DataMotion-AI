"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { prisma } from "@/lib/prisma";

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children, id }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch project details from the database
  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching project details for ID:", id);

      // Fetch the project using Prisma
      const matchedProject = await prisma.project.findUnique({
        where: { id },
        include: {
          user: true, 
          graphs: true
        },
      });

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
