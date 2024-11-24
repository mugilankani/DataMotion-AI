// pages/api/submitData.js
import formidable from "formidable";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req, res) => {
  const form = new formidable.IncomingForm();
  
  // Parse the form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    try {
      const { text } = fields; // Extract text from the fields
      const uploadedFile = files.file ? files.file[0] : null; // Extract file (if exists)

      // Log the received text and file (if any)
      console.log("Received text:", text);
      if (uploadedFile) {
        console.log("Received file:", uploadedFile);
      }

      // Validate the text before proceeding
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Text field cannot be empty" });
      }

      // Store the data in the database (text and optionally the file path)
      await prisma.formSubmission.create({
        data: {
          text,
          file: uploadedFile ? uploadedFile.filepath : null, // Store the file path if a file is uploaded
        },
      });

      // Send success response
      res.status(200).json({ message: "POST request successful!" });
    } catch (error) {
      console.error("Database operation error:", error);
      res.status(500).json({ error: "Failed to handle POST request" });
    }
  });
};
