import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function exportGraphCode() {
	try {
		// Read graphId from environment variables
		const graphId = process.env.GRAPH_ID;

		if (!graphId) {
			throw new Error("GRAPH_ID environment variable is not set.");
		}

		// Fetch the graph data from the database
		const graph = await prisma.graph.findUnique({
			where: { id: graphId },
			select: { graphCode: true },
		});

		if (!graph) {
			throw new Error(`Graph with ID "${graphId}" not found.`);
		}

		// Prepare the output path for the JSON file
		const outputPath = path.join(process.cwd(), "graph-output.json");

		// Stringify the graph data before writing
		const graphData = JSON.stringify(graph, null, 2);

		// Write the stringified data to the file
		fs.writeFileSync(outputPath, graphData, "utf8");

		console.log("✅ Graph code exported successfully to:", outputPath);
	} catch (error) {
		console.error("❌ Error exporting graph code:", error);
		process.exit(1);
	} finally {
		// Disconnect the Prisma Client
		await prisma.$disconnect();
	}
}

// Run the export function
exportGraphCode();
