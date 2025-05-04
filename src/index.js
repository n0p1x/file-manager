import { startFileManager } from './fileManager.js';

const username = process.argv.find(arg => arg.startsWith('--username=')).split('=')[1];

console.log(`Welcome to the File Manager, ${username}!`);

startFileManager(username);

process.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
});
