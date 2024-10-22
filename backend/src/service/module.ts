import Module from '$core/Module.ts'
import Router from './Router.ts'
import database from '$database/module.ts'

export default new Module()
    .extends(database)
    .register(Router, true)