import Module from "$core/Module.ts";
import Default from "./Default.ts";
import schemas from "./schemas/module.ts";

export default new Module()
  .extends(schemas)
  .register(Default, true);
