
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getGraphsByUser = async () => {
    try {
      // Validate user ID
      const session = await auth();
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }
      const userId = session.user.id;

      // Query the database to fetch graphs by user ID
      const graphs = await prisma.graph.findMany({
        where: { userId }, // Filtering graphs belonging to the current user
        orderBy: { createdAt: "desc" }, // Optional: Sort by created date, descending
      });
  
      if (!graphs.length) {
        return { success: true, message: "No graphs found for this user.", graphs: [] };
      }
  
      return { success: true, graphs };
    } catch (error) {
      console.error("Error fetching graphs:", error);
      return { success: false, error: error.message || "Failed to fetch graphs." };
    }
  };
  getGraphsByUser()