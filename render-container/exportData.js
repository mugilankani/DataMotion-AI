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

		const data = graph.graphCode;

		console.log(data);

		if (!graph) {
			throw new Error(`Graph with ID "${graphId}" not found.`);
		}

		// Prepare the output path for the JSX file
		const outputPath = path.join(
			process.cwd(),
			"my-video/src",
			"Chart.jsx"
		);

		// Write the graph code directly to the JSX file
		// Assuming graphCode contains the complete React component code
		fs.writeFileSync(outputPath, data, "utf8");

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
