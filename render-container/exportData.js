import fs from "fs";
import path from "path";

// Placeholder project data
const projectData = {
	id: 1,
	title: "Project 1",
	description: "This is the first project.",
	data: [
		{ id: 1, value: "Data 1.1" },
		{ id: 2, value: "Data 1.2" },
	],
};

// Function to write data to a JSON file
function exportProjectData() {
	try {
		// Write the data directly to the root directory
		const outputPath = path.join(process.cwd(), "video-data.json");

		fs.writeFileSync(
			outputPath,
			JSON.stringify(projectData, null, 2),
			"utf8"
		);

		console.log("✅ Data exported successfully to:", outputPath);
	} catch (error) {
		console.error("❌ Error exporting data:", error);
		process.exit(1);
	}
}

// Run the export function
exportProjectData();
