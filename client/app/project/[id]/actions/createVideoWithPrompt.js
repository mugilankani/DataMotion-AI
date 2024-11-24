"use server";

import { auth } from "@/lib/auth";

export default async function createVideoWithPrompt(prompt) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to create a video",
    };
  }

  console.log("Creating video with prompt:", prompt);

  setTimeout(() => {
    console.log("Simulating video creation...");
  }, 1000);

  // return { success: false, message: "Video creation failed." };

  return { success: true, message: "Video created successfully." };
}
