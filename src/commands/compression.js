import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';

export async function handleCompression(command, args, currentDir) {
  if (args.length !== 2) {
    throw new Error('Invalid number of arguments for compression/decompression');
  }

  const sourcePath = resolve(currentDir, args[0]);
  const destPath = resolve(currentDir, args[1]);

  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destPath);

  if (command === 'compress') {
    const brotli = createBrotliCompress();
    await pipeline(readStream, brotli, writeStream);
  } else if (command === 'decompress') {
    const brotli = createBrotliDecompress();
    await pipeline(readStream, brotli, writeStream);
  } else {
    throw new Error('Invalid compression command');
  }
}
