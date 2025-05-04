import { createReadStream, createWriteStream } from "fs";
import { unlink, rename, writeFile, stat, access } from "fs/promises";
import { join, resolve, basename } from "path";
import { pipeline } from "stream/promises";

export async function handleFileOperations(command, args, currentDir) {
  switch (command) {
    case "cat":
      return catFile(args[0], currentDir);
    case "add":
      return addFile(args[0], currentDir);
    case "rn":
      return renameFile(args[0], args[1], currentDir);
    case "cp":
      return copyFile(args[0], args[1], currentDir);
    case "mv":
      return moveFile(args[0], args[1], currentDir);
    case "rm":
      return removeFile(args[0], currentDir);
    default:
      throw new Error("Invalid file operation command");
  }
}

async function catFile(path, currentDir) {
  const fullPath = resolve(currentDir, path);
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(fullPath);
    readStream.on("error", (error) => {
      reject(error);
    });

    readStream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    readStream.on("end", () => {
      console.log(); // Add a newline at the end
      resolve();
    });
  });
}

async function addFile(name, currentDir) {
  const fullPath = join(currentDir, name);
  try {
    await access(fullPath);
    throw new Error("File already exists");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(fullPath, "");
    } else {
      throw error;
    }
  }
}

async function renameFile(oldPath, newName, currentDir) {
  const oldFullPath = resolve(currentDir, oldPath);
  const newFullPath = join(currentDir, newName);
  await rename(oldFullPath, newFullPath);
}

async function copyFile(sourcePath, destPath, currentDir) {
  try {
    const sourceFullPath = resolve(currentDir, sourcePath);
    let destFullPath = resolve(currentDir, destPath);

    try {
      await stat(sourceFullPath);
    } catch (error) {
      throw new Error(`Source file does not exist: ${sourcePath}`);
    }

    try {
      const destStats = await stat(destFullPath);

      if (destStats.isDirectory()) {
        destFullPath = join(destFullPath, basename(sourceFullPath));
      }
    } catch (error) {}

    const readStream = createReadStream(sourceFullPath);
    const writeStream = createWriteStream(destFullPath);

    await pipeline(readStream, writeStream);
  } catch (error) {
    console.error(`Copy error: ${error.message}`);
    throw error; // Re-throw to be caught by the main handler
  }
}

async function moveFile(sourcePath, destPath, currentDir) {
  try {
    const sourceFullPath = resolve(currentDir, sourcePath);
    let destFullPath = resolve(currentDir, destPath);

    try {
      await stat(sourceFullPath);
    } catch (error) {
      throw new Error(`Source file does not exist: ${sourcePath}`);
    }

    try {
      const destStats = await stat(destFullPath);

      if (destStats.isDirectory()) {
        destFullPath = join(destFullPath, basename(sourceFullPath));
      }
    } catch (error) {}

    try {
      await rename(sourceFullPath, destFullPath);
    } catch (error) {
      if (error.code === "EXDEV") {
        await copyFile(sourcePath, destPath, currentDir);
        await removeFile(sourcePath, currentDir);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`Move error: ${error.message}`);
    throw error;
  }
}

async function removeFile(path, currentDir) {
  const fullPath = resolve(currentDir, path);
  await unlink(fullPath);
}
