import { createNoDevtool } from "./index";
import { checkScriptUse } from "./plugins/script-use";

const config = checkScriptUse();
const controller = config ? createNoDevtool(config) : null;
controller?.start();

export { createNoDevtool };
