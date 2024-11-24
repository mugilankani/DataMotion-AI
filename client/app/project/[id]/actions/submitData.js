"use server"

import { prisma } from "@/lib/prisma";

export const submitData = async (formData, userName) => {
  try {
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(formData, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { text } = fields;
    const uploadedFile = files.file ? files.file[0] : null;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Text field cannot be empty");
    }

    let filePath = null;
    if (uploadedFile) {
      const tempPath = uploadedFile.filepath;
      const fileName = `uploads/${uploadedFile.originalFilename}`;
      filePath = `/path/to/your/storage/${fileName}`;
      await fs.copyFile(tempPath, filePath);
    }

    const jsonResponse = await generateJson(text);
    const graphResponse = await generateGraph(jsonResponse);

    // Find the user by name
    const user = await prisma.user.findUnique({
      where: { name: userName },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Save the generated graph and JSON structure in the database
    await prisma.graph.create({
      data: {
        title: jsonResponse.title,
        jsonData: JSON.stringify(jsonResponse),
        graphCode: graphResponse,
        type: jsonResponse.type,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return { success: true, message: "Data submitted and saved successfully!" };
  } catch (error) {
    console.error("Error handling form submission:", error);
    return { success: false, error: error.message || "Failed to handle request" };
  }
};
