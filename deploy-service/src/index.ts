import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import "dotenv/config";
import { buildProject } from "./build";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0,
    );
    // @ts-ignore;
    const id = res.element;
    console.log("This is id");
    await downloadS3Folder(`output/${id}`);
    await buildProject(id);
    await copyFinalDist(id);
    console.log("Copied Final dist/ to S3");

    publisher.hSet("status", id, "deployed");
  }
}
main();
