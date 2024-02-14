import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";

import "dotenv/config";
const subscriber = createClient();
subscriber.connect();

async function main() {
  while (1) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0,
    );
    const id = response?.element;
    await downloadS3Folder(`output/${id}`);
    console.log(response);
  }
}

main();
