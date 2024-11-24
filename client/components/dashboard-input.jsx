"use client";

import { useState } from "react";

import { toast } from "sonner";

import { submitData } from "@/app/dashboard/actions/submitData";

export default function DashboardInput() {
  const [inputText, setInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // New state for displaying API response
  const [isLoading, setIsLoading] = useState(false); // New state for loader

  const handleTextChange = (event) => {
    const value = event.target.value;
    setInputText(value);

    // Only validate for empty text
    if (!value.trim()) {
      setError("Please enter a valid prompt.");
    } else {
      setError("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log(`File uploaded: ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim() && !uploadedFile) {
      setError(
        "Please enter a valid prompt or upload a file. You can add the data with prompt or upload the files.",
      );
      return;
    }

    setError(""); // Clear previous errors
    setIsLoading(true); // Show loader while submitting

    try {
      const formData = new FormData();
      if (inputText.trim()) {
        formData.append("text", inputText); // Add text input to FormData
      }
      if (uploadedFile) {
        formData.append("file", uploadedFile); // Add file to FormData if it exists
      }

      // Making the API call (POST request)
      const { success, message } = await submitData(formData); // Wait for the API response

      // Check if the API call was successful
      if (success) {
        toast.success(message);
        setResponseMessage(message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting your data.");
      setError("An error occurred while submitting your data.");
    } finally {
      setIsLoading(false); // Hide the loader after submission
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputText.trim()) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="md:h-2/3 lg:w-1/2">
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-lg border border-gray-300 text-sm outline outline-2 outline-gray-100">
          {isLoading && (
            <div className="absolute left-0 right-0 top-0 flex h-full w-full items-center justify-center bg-white/25 font-semibold backdrop-blur-sm">
              Generating...
            </div>
          )}
          <input
            type="text"
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleTextChange}
            className="w-full px-3 pb-1 pt-3 focus-visible:outline-none"
            placeholder="Enter your prompt and data"
          />
          <div className="flex items-center justify-between">
            <div className="h-fit px-3 pb-3">
              <label className="inline-flex w-fit cursor-pointer items-center rounded-lg border p-1.5">
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </label>
            </div>
            <div className="h-fit px-2.5 pb-2.5">
              <button
                onClick={handleSubmit}
                className="cursor-pointer items-center rounded-lg bg-black p-1.5"
                disabled={(!inputText.trim() && !uploadedFile) || isLoading} // Disable button if no data is entered, file uploaded, or loading
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          {error && (
            <p className="w-fit flex-1 px-2 pt-2 text-xs text-red-500">
              {error}
            </p>
          )}
          <p className="ml-auto mt-2 w-fit text-end text-xs">
            You can add the data with prompt or upload the files
          </p>
        </div>
      </div>
    </>
  );
}
