import { createReadStream, createWriteStream, access } from "fs";
import { unlink, rename, writeFile, stat } from "fs/promises";
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
    access(fullPath);
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
  const sourceFullPath = resolve(currentDir, sourcePath);
  const destFullPath = resolve(currentDir, destPath);
  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  await pipeline(readStream, writeStream);
}

async function moveFile(sourcePath, destPath, currentDir) {
  const sourceFullPath = resolve(currentDir, sourcePath);
  let destFullPath = resolve(currentDir, destPath);

  try {
    const sourceStats = await stat(sourceFullPath);
    const destStats = await stat(destFullPath);

    if (destStats.isDirectory()) {
      // If destination is a directory, append the source filename
      destFullPath = join(destFullPath, basename(sourceFullPath));
    }

    await rename(sourceFullPath, destFullPath);
  } catch (error) {
    if (error.code === "EXDEV") {
      // If rename fails due to cross-device link, fall back to copy and delete
      await copyFile(sourcePath, destPath, currentDir);
      await removeFile(sourcePath, currentDir);
    } else {
      throw error;
    }
  }
}

async function removeFile(path, currentDir) {
  const fullPath = resolve(currentDir, path);
  await unlink(fullPath);
}
