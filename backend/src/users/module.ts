// @ts-nocheck: difficult typing
import Module from "$core/Module.ts";
import CreateUserHttp from "./http/Create.ts";
import AuthenticateUserHttp from "./http/Authenticate.ts";
import CreateUserMutation from "./mutations/Create.ts";
import AuthenticateUserMutation from "./mutations/Authenticate.ts";
import service from "$service/module.ts";

export default new Module()
  .extends(service)
  .register(CreateUserMutation)
  .register(AuthenticateUserMutation)
  .register(CreateUserHttp)
  .register(AuthenticateUserHttp);
