import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';

export async function handleHash(args, currentDir) {
  if (args.length !== 1) {
    throw new Error('Invalid number of arguments for hash command');
  }

  const filePath = resolve(currentDir, args[0]);
  const hash = createHash('sha256');
  const readStream = createReadStream(filePath);

  await pipeline(readStream, hash);
  console.log(hash.digest('hex'));
}
