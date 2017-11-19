'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:question-router');

const questionController  = require('../controllers/question');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /forms/questions/create Create new Question
 * @apiVersion 1.0.0
 * @apiName CreateQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} type Question Type ie _Yes/No_, _Fill In Blank_, or _Multiple Choice_
 * @apiParam {String} [sub_questions] Nested Sub Questions References
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {Array} options Questions Options
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "Yes/No",
 *    required: true
 *    sub_questions: [],
 *    options: ['Yes', 'No']
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie _Yes/No_, _Fill In Blank_, or _Multiple Choice_
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} options Questions Options
 * @apiSuccess {Array} single_choice Question Single Choice
 * @apiSuccess {Array} multiple_choice Question Multiple Choice
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "Yes/No",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    single_choice: [],
 *    multiple_choice: []
 *  }
 *
 */
router.post('/create', acl(['*']), questionController.create);


/**
 * @api {get} /forms/questions/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get questions collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Question
 *
 * @apiDescription Get a collection of questions. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie _Yes/No_, _Fill In Blank_, or _Multiple Choice_
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} options Questions Options
 * @apiSuccess {Array} single_choice Question Single Choice
 * @apiSuccess {Array} multiple_choice Question Multiple Choice
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    	_id : "556e1174a8952c9521286a60",
 *    	question_text: "Question Text Title",
 *    	remark: "This is a remark",
 *    	type: "Yes/No",
 *    	sub_questions: [{
 *		 	_id : "556e1174a8952c9521286a60",
 *       	....
 *    	}],
 *    	required: true
 *    	options: ['Yes', 'No'],
 *    	single_choice: [],
 *    	multiple_choice: []
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), questionController.fetchAllByPagination);

/**
 * @api {get} /forms/questions/:id Get Question Question
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Question
 *
 * @apiDescription Get a user question with the given id
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie _Yes/No_, _Fill In Blank_, or _Multiple Choice_
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} options Questions Options
 * @apiSuccess {Array} single_choice Question Single Choice
 * @apiSuccess {Array} multiple_choice Question Multiple Choice
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "Yes/No",
 *    sub_questions: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    required: true
 *    options: ['Yes', 'No'],
 *    single_choice: [],
 *    multiple_choice: []
 *  }
 *
 */
router.get('/:id', acl(['*']), questionController.fetchOne);


/**
 * @api {put} /forms/questions/:id Update Question Question
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Question 
 *
 * @apiDescription Update a Question question with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    remark: "This is a remark too"
 * }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie _Yes/No_, _Fill In Blank_, or _Multiple Choice_
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} options Questions Options
 * @apiSuccess {Array} single_choice Question Single Choice
 * @apiSuccess {Array} multiple_choice Question Multiple Choice
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark too",
 *    type: "Yes/No",
 *    sub_questions: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    required: true
 *    options: ['Yes', 'No'],
 *    single_choice: [],
 *    multiple_choice: []
 *  }
 */
router.put('/:id', acl(['*']), questionController.update);

// Expose Question Router
module.exports = router;
