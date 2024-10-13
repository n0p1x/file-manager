import { createInterface } from "readline";
import { homedir } from "os";
import { handleNavigation } from "./commands/navigation.js";
import { handleFileOperations } from "./commands/fileOperations.js";
import { handleOSInfo } from "./commands/osInfo.js";
import { handleHash } from "./commands/hash.js";
import { handleCompression } from "./commands/compression.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let currentDir = homedir();

export function startFileManager(username) {
  console.log(`You are currently in ${currentDir}`);
  rl.prompt();

  rl.on("line", async (input) => {
    if (input.trim() === ".exit") {
      rl.close();
      return;
    }

    try {
      const [command, ...args] = input.trim().split(" ");

      switch (command) {
        case "up":
        case "cd":
        case "ls":
          currentDir = await handleNavigation(command, args, currentDir);
          break;
        case "cat":
        case "add":
        case "rn":
        case "cp":
        case "mv":
        case "rm":
          await handleFileOperations(command, args, currentDir);
          break;
        case "os":
          await handleOSInfo(args);
          break;
        case "hash":
          await handleHash(args, currentDir);
          break;
        case "compress":
        case "decompress":
          await handleCompression(command, args, currentDir);
          break;
        default:
          console.log("Invalid input");
      }
    } catch (error) {
      console.log("Operation failed");
    }

    console.log(`You are currently in ${currentDir}`);
    rl.prompt();
  });

  rl.on("close", () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  });
}
