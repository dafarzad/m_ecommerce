import "server-only";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

class FileService {
  async saveFile(file: File) {
    if (!file || !file.name || !file.arrayBuffer) {
      throw new Error("Invalid file input");
    }
    // Extract file extension
    const extension = path.extname(file.name);

    const baseName = path
      .basename(file.name, extension)
      .replace(/[^a-z0-9]/gi, "_") // Replace special characters with underscores
      .toLowerCase()
      .slice(0, 50); // Limit length for readability

    const timestamp = Date.now();

    // Use a short UUID to ensure uniqueness
    const shortUUID = uuidv4().split("-")[0];

    // Create a user-friendly, unique file name
    const uniqueName = `${baseName}_${timestamp}_${shortUUID}${extension}`;

    const relativePath = path.join("uploads", "images", uniqueName);
    // Define the full file path with the unique name
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    if (!fs.existsSync(path.dirname(absolutePath))) {
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    }

    // Convert the arrayBuffer to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save the file to the server
    await fs.promises.writeFile(absolutePath, buffer);

    return relativePath;
  }

  async deleteFile(fileUrl: string) {
    if (!fileUrl) {
      throw new Error("File URL is required");
    }

    const urlObj = new URL(fileUrl);
    // Extract the pathname and construct the absolute path
    const filePath = path.join(process.cwd(), "public", urlObj.pathname);

    // Check if file exists before trying to delete it
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // Delete the file
    await fs.promises.unlink(filePath);

    return true;
  }

  getUrlFromRelativePath(relativePath: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Adjust to your deployment URL
    return `${baseUrl}/${relativePath}`;
  }
}

export default new FileService();
