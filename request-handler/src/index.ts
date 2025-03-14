import express from "express";
import { S3 } from "aws-sdk";

import "dotenv/config";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  endpoint: process.env.ENDPOINT!,
});

const app = express();

app.get("/*", async (req, res) => {
  try {
    const host = req.hostname;
    const id = host.split(".")[0];
    let filePath = req.path;

    // If path is empty or just /, default to index.html
    if (filePath === "/" || filePath === "") {
      filePath = "/index.html";
    }

    const fileKey = `dist/${id}${filePath}`;
    console.log("Attempting to fetch:", fileKey);

    try {
      const contents = await s3
        .getObject({
          Bucket: process.env.S3_BUCKET!,
          Key: fileKey,
        })
        .promise();

      // Expanded content type handling
      let type = "application/octet-stream"; // Default
      if (filePath.endsWith(".html")) type = "text/html";
      else if (filePath.endsWith(".css")) type = "text/css";
      else if (filePath.endsWith(".js")) type = "application/javascript";
      else if (filePath.endsWith(".json")) type = "application/json";
      else if (filePath.endsWith(".png")) type = "image/png";
      else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
        type = "image/jpeg";
      else if (filePath.endsWith(".svg")) type = "image/svg+xml";

      res.set("Content-Type", type);
      res.send(contents.Body);
    } catch (error) {
      // If path doesn't end with a file extension, try index.html (for SPA routing)
      if (!filePath.includes(".")) {
        try {
          const spaKey = `dist/${id}/index.html`;
          console.log("Attempting SPA fallback:", spaKey);

          const contents = await s3
            .getObject({
              Bucket: process.env.S3_BUCKET!,
              Key: spaKey,
            })
            .promise();

          res.set("Content-Type", "text/html");
          res.send(contents.Body);
        } catch (spaError) {
          console.error("SPA fallback failed:", spaError);
          res.status(404).send("File not found");
        }
      } else {
        throw error; // Re-throw to be caught by outer catch
      }
    }
  } catch (error) {
    console.error("S3 Fetch Error:", error);
    res.status(404).send("File not found");
  }
});

// Add this to your code temporarily for debugging
app.get("/debug-list", async (req, res) => {
  try {
    const listParams = {
      Bucket: process.env.S3_BUCKET!,
      Prefix: "dist/",
    };

    const data = await s3.listObjectsV2(listParams).promise();
    res.json(data.Contents ? data.Contents.map((item) => item.Key) : []);
  } catch (error: any) {
    console.error("S3 List Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
