'use strict';

/**
 * Load Module Dependencies
 */
const Router = require('koa-router');
const debug  = require('debug')('api:app-router');

const rootRouter          = require('./root');
const formRouter      = require('./form');
const questionRouter      = require('./question');
const sectionRouter      = require('./section');

var appRouter = new Router();

const OPEN_ENDPOINTS = [
    /\/assets\/.*/,
    '/'
];

// Open Endpoints/Requires Authentication
appRouter.OPEN_ENDPOINTS = OPEN_ENDPOINTS;

// Add Root Router
composeRoute('', rootRouter);
//Add clients Router
composeRoute('forms', formRouter);
//Add questions Router
composeRoute('forms/questions', questionRouter);
//Add sections Router
composeRoute('forms/sections', sectionRouter);

function composeRoute(endpoint, router){
  appRouter.use(`/${endpoint}`, router.routes(), router.allowedMethods());
}
// Export App Router
module.exports = appRouter;
