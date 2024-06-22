import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CPUcore = os.availableParallelism();

cluster.setupPrimary({
  exec: __dirname + "/index.js",
});

for (let index = 0; index < CPUcore; index++) {
  cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} has killed`);
  console.log("started another worker");
  cluster.fork();
});
