import { join, resolve, parse } from "path";
import { readdir, stat } from "fs/promises";

export async function handleNavigation(command, args, currentDir) {
  switch (command) {
    case "up":
      return goUp(currentDir);
    case "cd":
      return changeDirectory(args[0], currentDir);
    case "ls":
      await listDirectory(currentDir);
      return currentDir;
    default:
      throw new Error("Invalid navigation command");
  }
}

function goUp(currentDir) {
  const parentDir = resolve(currentDir, "..");
  if (parentDir === currentDir) {
    console.log("You are already at the root directory.");
    return currentDir;
  }
  return parentDir;
}

async function changeDirectory(path, currentDir) {
  const newPath = resolve(currentDir, path);
  try {
    const stats = await stat(newPath);
    if (!stats.isDirectory()) {
      throw new Error("Not a directory");
    }
    return newPath;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
}

async function listDirectory(currentDir) {
  const items = await readdir(currentDir);
  const itemDetails = await Promise.all(
    items.map(async (item) => {
      const fullPath = join(currentDir, item);
      const stats = await stat(fullPath);
      return {
        name: item,
        type: stats.isDirectory() ? "directory" : "file",
      };
    }),
  );

  // Sort items: directories first, then files, both in alphabetical order
  itemDetails.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  console.table(itemDetails);
}
