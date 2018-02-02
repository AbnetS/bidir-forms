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
 * @apiParam {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "YES_NO",
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "YES_NO",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create', acl(['*']), questionController.create);

/**
 * @api {post} /forms/questions/create/grouped Create Grouped Question
 * @apiVersion 1.0.0
 * @apiName CreateGroupedQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Grouped Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} show Question to be shown or not(true or false)
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 * @apiParam {Array} sub_questions Nested Sub Questions References
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    show: true,
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *    sub_questions: ["556e1174a8952c9521286a60"]
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "GROUPED",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create/grouped', acl(['*']), questionController.createGrouped);

/**
 * @api {post} /forms/questions/create/fib Create Fill In Blanks Question
 * @apiVersion 1.0.0
 * @apiName CreateFIBQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Fill In Blanks Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} show Question to be shown or not(true or false)
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    show: true,
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type FILL_IN_BLANK
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "FILL_IN_BLANK",
 *    sub_questions: [],
 *    required: true
 *    options: [],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create/fib', acl(['*']), questionController.createFIB);

/**
 * @api {post} /forms/questions/create/sc Create Single Choice Question
 * @apiVersion 1.0.0
 * @apiName CreateSCQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Single Choice Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} show Question to be shown or not(true or false)
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 * @apiParam {Array} options Question Options
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    show: true,
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *    options: ['Choice 1', 'Choice 2']
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type SINGLE_CHOICE
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "SINGLE_CHOICE",
 *    sub_questions: [],
 *    required: true
 *    options: ['CHOICE 1', 'CHOICE 2'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create/sc', acl(['*']), questionController.createSC);

/**
 * @api {post} /forms/questions/create/mc Create Multiple Choice Question
 * @apiVersion 1.0.0
 * @apiName CreateMCQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Multiple Choice Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} show Question to be shown or not(true or false)
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 * @apiParam {Array} options Question Options
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    show: true,
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *    options: ['CHOICE 1', 'CHOICE 2'],
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type MULTIPLE_CHOICE
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "MULTIPLE_CHOICE",
 *    sub_questions: [],
 *    required: true
 *    options: [],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create/mc', acl(['*']), questionController.createMC);

/**
 * @api {post} /forms/questions/create/yn Create Yes/No Question
 * @apiVersion 1.0.0
 * @apiName CreateYNQuestion
 * @apiGroup Question
 *
 * @apiDescription Create new Yes No Question.
 *
 * @apiParam {String} question_text Question Text Title
 * @apiParam {String} remark Question Remark
 * @apiParam {String} show Question to be shown or not(true or false)
 * @apiParam {Boolean} required Question required or not(true or false)
 * @apiParam {String} form Form containing Question
 * @apiParam {Array} options Question Options
 *
 * @apiParamExample Request Example:
 *  {
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    show: true,
 *    required: true,
 *    form: "556e1174a8952c9521286a60"
 *    options: ['Yes', 'No'],
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text Title
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type YES_NO
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "YES_NO",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 *
 */
router.post('/create/yn', acl(['*']), questionController.createYN);



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
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *        _id : "556e1174a8952c9521286a60",
 *        question_text: "Question Text Title",
 *        remark: "This is a remark",
 *        type: "YES_NO",
 *        sub_questions: [],
 *        required: true
 *        options: ['Yes', 'No'],
 *        value: '',
 *        show: true,
 *        prerequisities: [],
 *        validation_factor: "NONE",
 *        measurement_unit: ""
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
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "YES_NO",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
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
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question required or not(true or false)
 * @apiSuccess {Array} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Array} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    question_text: "Question Text Title",
 *    remark: "This is a remark",
 *    type: "YES_NO",
 *    sub_questions: [],
 *    required: true
 *    options: ['Yes', 'No'],
 *    value: '',
 *    show: true,
 *    prerequisities: [],
 *    validation_factor: "NONE",
 *    measurement_unit: ""
 *  }
 */
router.put('/:id', acl(['*']), questionController.update);

// Expose Question Router
module.exports = router;
