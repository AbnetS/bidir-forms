'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:section-router');

const sectionController  = require('../controllers/section');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /forms/sections/create Create new Section
 * @apiVersion 1.0.0
 * @apiName CreateSection
 * @apiGroup Section
 *
 * @apiDescription Create new Section. 
 *
 * @apiParam {String} title Section Title
 * @apiParam {Array} [questions] Section Questions
 * @apiParam {String} form Form associated with section
 *
 * @apiParamExample Request Example:
 *  {
 *    title: "Crop Fertiliser Distribution ",
 *    questions : ["556e1174a8952c9521286a60"],
 *    form : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {Array} questions Section Questions
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser Distribution ",
 *    questions: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 *
 */
router.post('/create', acl(['*']), sectionController.create);



/**
 * @api {get} /forms/sections/:id Get Section Section
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Section
 *
 * @apiDescription Get a user section with the given id
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {Array} questions Section Questions
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser Distribution ",
 *    questions: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 *
 */
router.get('/:id', acl(['*']), sectionController.fetchOne);


/**
 * @api {put} /forms/sections/:id Update Section Section
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Section 
 *
 * @apiDescription Update a Section section with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {Array} questions Section Questions
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser and Chemicals Distribution ",
 *    questions: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 */
router.put('/:id', acl(['*']), sectionController.update);

// Expose Section Router
module.exports = router;
