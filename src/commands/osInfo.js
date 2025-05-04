import { EOL, cpus, homedir, userInfo, arch } from 'os';

export async function handleOSInfo(args) {
  switch (args[0]) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      printCPUsInfo();
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      throw new Error('Invalid OS info command');
  }
}

function printCPUsInfo() {
  const cpuInfo = cpus();
  console.log(`Total CPUs: ${cpuInfo.length}`);
  cpuInfo.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}:`);
    console.log(`  Model: ${cpu.model}`);
    console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
  });
}
