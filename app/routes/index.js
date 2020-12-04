import express from 'express'
import { Router } from 'express'

// Import all the routes
import { utilsRoutes } from './utilsRoutes.js' 
//import { controllerRoutes } from './controllerRoutes'
//import { webhookRoutes } from './webHookRoutes'


// Use all these routes in the router
let apiRouter = Router() 
  .use('/utilsRoutes', utilsRoutes)
//  .use('/controllerRoutes', controllerRoutes)
//.use('/anotherpath', another_router) 

export default { apiRouter }