import { startPinWorker } from "@/workers/pin-worker";
import { startBulkWorker } from "@/workers/bulk-worker";

startPinWorker();
startBulkWorker();
console.log("PinFashion AI workers started");
