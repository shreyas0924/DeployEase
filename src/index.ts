import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateRandomId } from "./generateRandom";
import simpleGit from "simple-git";
import path from "path";
const app: Express = express();
const port = process.env.PORT || 3000;
dotenv.config();

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

  res.json({
    id: id,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
