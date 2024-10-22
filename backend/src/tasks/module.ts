import Module from '$core/Module.ts'
import CreateTaskHttp from './http/Create.ts'
import service from '$service/module.ts'
import CreateTaskMutation from "./mutations/Create.ts"

export default new Module()
  .extends(service)
  .register(CreateTaskMutation)
  .register(CreateTaskHttp)