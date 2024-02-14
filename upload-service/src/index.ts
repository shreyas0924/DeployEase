import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { generateRandomId } from "./generateRandom";
import simpleGit from "simple-git";
import path from "path";
import { getAllFiles } from "./getAllFiles";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/deploy", async (req: Request, res: Response) => {
  const repoUrl = req.body.repoUrl;
  const id = generateRandomId();

  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  console.log(repoUrl);

  const files = getAllFiles(path.join(__dirname, `output/${id}`));
  console.log(files);

  //upload to s3
  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  //push the id to redis queue
  publisher.lPush("build-queue", id);

  res.json({
    id: id,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
