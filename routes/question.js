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
 * @apiDescription Create a new Question.
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {String} type Type of the question i.e YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiParam {Boolean} [required] Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String} [validation_factor] Validation rule to be applied against the answer of the question. Allowed values are 'NONE', 'ALPHANUMERIC', 'NUMERIC', 'ALPHABETIC'
 *                                        Default value is 'NONE'
 * @apiParam {String} [measurement_unit] Measurement unit
 * @apiParam {String[]} [options] Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} [parent_question] if the Question is a sub_question
 * @apiParam {Boolean} [show] Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 * 
 * @apiParamExample Request Example:
 *  {
        number: 1
        question_text: "What is the age of the client?"
        remark: "Age should be less than 65"
        measurement_unit: "Years"
        form: "5def47b7cda72e00018b528a"       
        prerequisites: []        
        required: true
        show: true
        validation_factor: "NUMERIC"
    }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
    {
        "_id": "5def536acda72e00018b5291",
        "question_text": "What is the age of the client?",
        "prerequisites": [],
        "show": true,
        "values": [],
        "sub_questions": [],
        "options": [],
        "measurement_unit": "Years",
        "validation_factor": "NUMERIC",
        "required": true,
        "type": "FILL_IN_BLANK",
        "remark": "Age should be less than 65",
        "number": 1
    }
 *
 */
router.post('/create', acl(['*']), questionController.create);

/**
 * @api {post} /forms/questions/create/grouped Create Grouped Question
 * @apiVersion 1.0.0
 * @apiName CreateGroupedQuestion
 * @apiGroup Question
 *
 * @apiDescription Create a new Grouped Question. A grouped question is a group of multiple FILL_IN_BLANK questions. 
 *                 The parent question will have a title. To create the subquestions, refer to CreateFIBQuestion API endpoint
 *                 
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String} validation_factor Validation rule to be applied against the answer of the question. Allowed values are 'NONE', 'ALPHANUMERIC', 'NUMERIC', 'ALPHABETIC'
 *                                        Default value is 'NONE'
 * @apiParam {String} measurement_unit Measurement unit
 * @apiParam {String[]} [options] Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} [parent_question] if the Question is a sub_question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 * @apiParamExample Request Example:
 *  {
        form: "5def47b7cda72e00018b528a"
        measurement_unit: null
        number: 5
        prerequisites: []
        question_text: "Specify total land size:"
        required: true
        show: 1
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
        _id: "5def6072cda72e00018b52a1"    
        number: 5
        options: []
        prerequisites: []
        question_text: "Specify total land size:"
        remark: ""
        required: true
        show: true
        sub_questions: []
        type: "GROUPED"
        validation_factor: "NONE"
        measurement_unit: null
        values: []
        
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
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String} validation_factor Validation rule to be applied against the answer of the question. Allowed values are 'NONE', 'ALPHANUMERIC', 'NUMERIC', 'ALPHABETIC'
 *                                        Default value is 'NONE'
 * @apiParam {String} measurement_unit Measurement unit
 * @apiParam {String[]} [options] Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} [parent_question] if the Question is a sub_question, specify the id of the parent question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 * @apiParamExample Request Example:
 *  {
        number: 1
        question_text: "What is the age of the client?"
        remark: "Age should be less than 65"
        measurement_unit: "Years"
        form: "5def47b7cda72e00018b528a"       
        prerequisites: []        
        required: true
        show: true
        validation_factor: "NUMERIC"
    }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
    {
        "_id": "5def536acda72e00018b5291",
        "question_text": "What is the age of the client?",
        "prerequisites": [],
        "show": true,
        "values": [],
        "sub_questions": [],
        "options": [],
        "measurement_unit": "Years",
        "validation_factor": "NUMERIC",
        "required": true,
        "type": "FILL_IN_BLANK",
        "remark": "Age should be less than 65",
        "number": 1
    }
 *
 */
router.post('/create/fib', acl(['*']), questionController.createFIB);

/**
 * @api {post} /forms/questions/create/fib Create Fill In Blank sub question for a grouped question
 * @apiVersion 1.0.0
 * @apiName CreateFIBSubQuestion
 * @apiGroup Question
 *
 * @apiDescription Create a new Fill In Blanks sub question.
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String} validation_factor Validation rule to be applied against the answer of the question. Allowed values are 'NONE', 'ALPHANUMERIC', 'NUMERIC', 'ALPHABETIC'
 *                                        Default value is 'NONE'
 * @apiParam {String} measurement_unit Measurement unit
 * @apiParam {String[]} [options] Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} parent_question if the Question is a sub_question, specify the id of the parent question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 * @apiParamExample Request Example:
 *  {
        form: "5def47b7cda72e00018b528a"
        measurement_unit: "ha"
        number: 0
        parent_question: "5def6072cda72e00018b52a1"
        question_text: "Own land:"
        required: true
        show: true
        sub_question_type: "fib"
        validation_factor: "NONE"        
    }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
    {
        _id: "5def6073cda72e00018b52a2"
        measurement_unit: "ha"
        number: 0
        options: []
        prerequisites: []
        question_text: "Own land:"
        remark: ""
        required: true
        show: true
        sub_questions: []
        type: "FILL_IN_BLANK"
        validation_factor: "NONE"
        values: []        
    }
 *
 */
router.post('/create/fib', acl(['*']), questionController.createFIB);


/**
 * @api {post} /forms/questions/create/sc Create Single Choice Question
 * @apiVersion 1.0.0
 * @apiName CreateSCQuestion
 * @apiGroup Question
 *
 * @apiDescription Create a new Single Choice Question.
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String[]} options Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} [parent_question] if the Question is a sub_question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 *
 * @apiParamExample Request Example:
 * {
        question_text: "Does the farmer have a good credit history with the MFI?"
        number: 2
        form: "5def47b7cda72e00018b528a"         
        options: ["Yes", "Bad credit history", "Applicant does not have credit history with the MFI"]
        prerequisites: []        
        remark: "Bad credit history results in rejection"
        required: true
        show: true
 }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 {
    "_id": "5def5c56cda72e00018b529a",
    "question_text": "Does the farmer have a good credit history with the MFI?",
    "prerequisites": [],
    "show": true,
    "values": [],
    "sub_questions": [],
    "options": [
        "Yes",
        "Bad credit history",
        "Applicant does not have credit history with the MFI"
    ],
    "measurement_unit": null,
    "validation_factor": "NONE",
    "required": true,
    "type": "SINGLE_CHOICE",
    "remark": "Bad credit history results in rejection",
    "number": 2
}
 *
 */
router.post('/create/sc', acl(['*']), questionController.createSC);

/**
 * @api {post} /forms/questions/create/mc Create Multiple Choice Question
 * @apiVersion 1.0.0
 * @apiName CreateMCQuestion
 * @apiGroup Question
 *
 * @apiDescription Create a new Multiple Choice Question.
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String[]} options Options from which an answer is selected, applicable only for MULTIPLE_CHOICE, and SINGLE_CHOICE question types
 * @apiParam {String} [parent_question] if the Question is a sub_question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 * @apiParamExample Request Example:
 *  {
        question_text: "What crops do the farmer want to cultivate?"
        form: "5def47b7cda72e00018b528a"        
        number: 3
        options: ["Onion", "Tomato", "Cabbage", "Greenpepper"]
        prerequisites: []        
        required: true
        show: true
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
        _id: "5def5df3cda72e00018b529d"    
        number: 3
        options: ["Onion", "Tomato", "Cabbage", "Greenpepper"]
        prerequisites: []
        question_text: "What crops do the farmer want to cultivate?"
        measurement_unit: null
        remark: ""
        required: true
        show: true
        sub_questions: []
        type: "MULTIPLE_CHOICE"
        validation_factor: "NONE"
        values: []       
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
 * @apiDescription Create a new Yes/No Question.
 *
 * @apiParam {String} question_text Question Text 
 * @apiParam {String} number Question Order number
 * @apiParam {String} [remark] Remark to be displayed with the question
 * @apiParam {Boolean} required Determines whether the question is mandatory or not (true or false). Default value is false.
 * @apiParam {String} form Form id in which the question is to be created
 * @apiParam {String} [parent_question] if the Question is a sub_question
 * @apiParam {Boolean} show Determines whether the question is shown all the time (in which the cause the value is true).
 * @apiParam {Object[]} [prerequisites] List of questions that should be answered in a specific way so that this quesiton is answered
 *
 * @apiParamExample Request Example:
 *  {
        question_text: "Does the farmer has a guarantor?"
        remark: "A farmer should have at least one guarantor."
        form: "5def47b7cda72e00018b528a"        
        number: 4
        options: ["Yes", "No"]
        prerequisites: []        
        required: false
        show: true
 *  }
 *
 * @apiSuccess {String} _id question id
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
        _id: "5def5f3acda72e00018b529f"        
        number: 4
        options: ["Yes", "No"]
        prerequisites: []
        question_text: "Does the farmer has a guarantor?"
        remark: "A farmer should have at least one guarantor."
        required: false
        show: true
        sub_questions: []
        type: "YES_NO"
        measurement_unit: null
        validation_factor: "NONE"
        values: []
        
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
 * @apiSuccess {String} question_text Question Text 
 * @apiSuccess {String} remark Question Remark
 * @apiSuccess {String} type Question Type ie YES_NO, FILL_IN_BLANK, MULTIPLE_CHOICE, SINGLE_CHOICE, GROUPED
 * @apiSuccess {String} sub_questions Nested Sub Questions References
 * @apiSuccess {Boolean} required Question mandatory or not(true or false)
 * @apiSuccess {String} validation_factor Question Validation Factor ie NONE, ALPHANUMERIC, NUMERIC, ALPHABETIC
 * @apiSuccess {Array} values Question Answer Values
 * @apiSuccess {Array} options Question Choices Options
 * @apiSuccess {Boolean} show Show Question true or false
 * @apiSuccess {Object[]} prerequisities Question Prerequisities
 * @apiSuccess {String} measurement_unit Measurement Unit
 * @apiSuccess {String} number Question Order number
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
 *        measurement_unit: "",
 *        number: "1.1"
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), questionController.fetchAllByPagination);

/**
 * @api {get} /forms/questions/:id Get Question
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Question
 *
 * @apiDescription Get a question with the given id
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
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 {
    "_id": "5def6072cda72e00018b52a1",
    "question_text": "Specify total land size:",
    "prerequisites": [],
    "show": true,
    "values": [],
    "sub_questions": [
        {
            "_id": "5def6073cda72e00018b52a2",
            "question_text": "Own land:",
            "prerequisites": [],
            "show": true,
            "values": [],
            "sub_questions": [],
            "options": [],
            "measurement_unit": "ha",
            "validation_factor": "NONE",
            "required": true,
            "type": "FILL_IN_BLANK",
            "remark": "",
            "number": 0
        },
        {
            "_id": "5def6073cda72e00018b52a3",
            "question_text": "Rented land:",
            "prerequisites": [],
            "show": true,
            "values": [],
            "sub_questions": [],
            "options": [],
            "measurement_unit": "ha",
            "validation_factor": "NONE",
            "required": true,
            "type": "FILL_IN_BLANK",
            "remark": "",
            "number": 0
        }
    ],
    "options": [],
    "measurement_unit": null,
    "validation_factor": "NONE",
    "required": true,
    "type": "GROUPED",
    "remark": "",
    "number": 5
}
 */
router.get('/:id', acl(['*']), questionController.fetchOne);


/**
 * @api {put} /forms/questions/:id Update Question
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Question 
 *
 * @apiDescription Update a question with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    "remark": "Total land size should be greater than 1 ha"
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
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5def6072cda72e00018b52a1",
        "question_text": "Specify total land size:",
        "prerequisites": [],
        "show": true,
        "values": [],
        "sub_questions": [
            {
                "_id": "5def6073cda72e00018b52a2",
                ...
        ],
        "options": [],
        "measurement_unit": null,
        "validation_factor": "NONE",
        "required": true,
        "type": "GROUPED",
        "remark": "Total land size should be greater than 1 ha",
        "number": 5
 *  }
 */
router.put('/:id', acl(['*']), questionController.update);

/**
 * @api {delete} /forms/questions/:id?form=<FORM_REFERENCE> Delete  Question
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Question 
 *
 * @apiDescription Remove a Question question with the given id.
 *  specify /?form=<FORM_ID> or /?parent_question=<PARENT_Q_ID> if removing from grouped
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
 * @apiSuccess {String} number Question Order number
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
 *    measurement_unit: "",
 *    number: "1.1"
 *  }
 */
router.delete('/:id', acl(['*']), questionController.remove);

// Expose Question Router
module.exports = router;
