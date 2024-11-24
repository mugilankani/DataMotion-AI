"use server"

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Base directory for chart components
const baseDir = "../../../../components/charts";

// Dynamically generate paths for different chart components
const componentPaths = {
  pie: path.join(baseDir, "Pie.jsx"),
  bar: path.join(baseDir, "Bar.jsx"),
  line: path.join(baseDir, "Line.jsx"),
  bubble: path.join(baseDir, "Bubble.jsx"),
  radar: path.join(baseDir, "Radar.jsx"),
};

// Read chart components dynamically
const componentTemplates = Object.fromEntries(
  Object.entries(componentPaths).map(([type, filePath]) => [
    type,
    fs.readFileSync(filePath, "utf8"),
  ])
);

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});

// Create an output parser for JSON structure
const parser = new JsonOutputParser();

// Prompt for generating graph JSON structure
const promptTemplatetogenerateJson = PromptTemplate.fromTemplate(
  `Please create a graph JSON structure based on the following prompt: 
   "{prompt}".
   Ensure to generate the JSON in a format suitable for rendering various types of graphs (pie, bar, line, radar, bubble) with all relevant attributes such as labels, datasets, etc.
   The output should be structured in a clean and easily usable format:

   {{
  "title": "create a suitable title based on prompt"
  "type": "graph_type", // e.g., bar, line, pie, etc.
  "data": {{
    "labels": ["label1", "label2", "label3", ...],
    "datasets": [
      {{
        "label": "Dataset Name",
        "data": [value1, value2, value3, ...],
        "backgroundColor": ["#FF0000", "#00FF00", "#0000FF"],
        "borderColor": ["#FF0000", "#00FF00", "#0000FF"],
        "borderWidth": 1
    }}
    ]
    }}
    }}

   Format the response as a valid JSON object.`
);

// Prompt for generating the final graph component code
const generateGraphResponse = PromptTemplate.fromTemplate(
  `Generate the graph using this data "{Json}" and 
   using this component, insert the data into that component "{Component}".
   Please ensure you include the necessary import statements for all dependencies like React, useEffect, useRef, motion, gsap, etc.
   Only modify the data part of the component, and do not change any animations or other static elements. 
   Return only the modified component code as a plain string, with no markdown and no other text. Ensure that the component works with client-side rendering by adding the "use client" directive if needed.`
);

export async function generateJson(promptData) {
  try {
    const prompt = await promptTemplatetogenerateJson.format({ prompt: promptData });
    const response = await model.invoke(prompt);
    const jsonResponse = await parser.parse(response.content);

    console.log("Graph JSON response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error generating graph JSON:", error);
    throw error;
  }
}

export async function generateGraph(JsonResponse) {
  try {
    const graphType = JsonResponse.type.toLowerCase(); // Determine graph type
    const componentCode = componentTemplates[graphType]; // Match to component

    if (!componentCode) {
      throw new Error(`Component for graph type "${graphType}" not found.`);
    }

    const prompt = await generateGraphResponse.format({
      Json: JSON.stringify(JsonResponse), // Pass the JSON response
      Component: componentCode,
    });

    const response = await model.invoke(prompt);
    const cleanedResponse = response.content.replace(/```javascript\s*|\s*```/g, "").trim();

    console.log(cleanedResponse); // Final graph component code
    return cleanedResponse;
  } catch (error) {
    console.error("Error generating graph component:", error);
    throw error;
  }
}
