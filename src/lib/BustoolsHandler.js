import Aioli from '@biowasm/aioli';
import { getNewBusFileHandle, getNewFileHandle, writeFile } from './fs-helper';

async function getCLI() {
  const CLI = await new Aioli([{
    tool: "bustools",
    version: "",
    program: "",
    urlPrefix: "http://localhost:8080/public",
    loading: "lazy",
    reinit: false, // Optional: if set to true, will reinitialize module after each invocation; not needed for most tools
  }], {
    printInterleaved: true,
    debug: false, // Optional: set to true to see console log messages for debugging (default: false)
  });
  return CLI;
}

async function bus_text(inputFile) {
  try {
    let outputFileHandle = await getNewFileHandle();
    let CLI = await getCLI();
    await CLI.mount([inputFile]);
    const output = await CLI.exec(`bustools text -p /shared/data/${inputFile.name}`);
    await writeFile(outputFileHandle, output);
  } catch (err) {
    return false;
  }
  return true;
}
 
async function bus_sort(busFile) {
  let out = await getNewBusFileHandle();
  let CLI = await getCLI();
  await CLI.mount([busFile]);
  const y = await CLI.exec(`bustools sort -T /shared/data/temp -m 1G -p /shared/data/${busFile.name}`);
  await writeFile(out, y);
}


export { bus_text, bus_sort };