"use server";

import fs from "fs/promises";
import path from "path";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generateGraph, generateJson } from "./transformPromptToJson";

export async function submitData(formData) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const text = formData.get("text");
    const file = formData.get("file");

    // Validate the text field
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Text field cannot be empty");
    }

    // Handle file upload if present
    let filePath = null;
    if (file && file instanceof File) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${Date.now()}-${file.name}`;
      filePath = `/uploads/${fileName}`; // Store relative path in DB

      // Write the uploaded file
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(uploadsDir, fileName), buffer);
    }

    // Generate JSON and graph
    const jsonResponse = await generateJson(text);
    if (!jsonResponse) {
      throw new Error("Failed to generate JSON response");
    }

    const graphResponse = await generateGraph(jsonResponse);
    if (!graphResponse) {
      throw new Error("Failed to generate graph response");
    }

    const graph = await prisma.graph.create({
      data: {
        title: jsonResponse.title || "Untitled Graph",
        jsonData: JSON.stringify(jsonResponse),
        graphCode: graphResponse,
        type: jsonResponse.type || "bar",
        userId: session.user.id,
      },
    });

    console.log(graph);

    return {
      success: true,
      message: "Project started successfully!",
      graphId: graph.id,
    };
  } catch (error) {
    console.error("Error handling form submission:", error);
    return {
      success: false,
      error: error.message || "Failed to handle request",
    };
  }
}
