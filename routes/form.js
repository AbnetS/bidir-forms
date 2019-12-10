'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:form-router');

const formController      = require('../controllers/form');
const authController      = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /forms/create Create new Form
 * @apiVersion 1.0.0
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiDescription Create a new form. 
 *
 * @apiParam {String} title Form Title 
 * @apiParam {String} [subtitle] Form Subtitle
 * @apiParam {String} [purpose] Form Purpose
 * @apiParam {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiParam {String} layout Form's layout i.e 'TWO_COLUMNS' or 'THREE_COLUMNS'. This will determine the layout the form when presented for the user.
 * @apiParam {Boolean} [has_sections] Determines whether the form has sections or not (true or false).
 *  
 * 
 * 
 * @apiParamExample Request Example:
 *  {
        title: "Loan Application Form",
        type: "LOAN_APPLICATION",
        has_sections: false,
        layout: "THREE_COLUMNS",
        purpose: "A loan application form is used to record loan application details of a client",
          
 *  }
 * 
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} subtitle Form Subtitle 
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Object[]} questions Form Questions
 * @apiSuccess {String} layout Form Layout i.e TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by User account id who creates the form
 * @apiSuccess {Object[]} sections Form Sections
 * @apiSuccess {Boolean} has_sections true, if Form has Sections
 * @apiSuccess {String} disclaimer Disclaimer
 * @apiSuccess {String[]} signatures Accepted Signatures
 *
 * @apiSuccessExample Response Example:
    {
        "_id": "5def47b7cda72e00018b528a",
        "last_modified": "2019-12-10T07:22:31.854Z",
        "date_created": "2019-12-10T07:22:31.854Z",
        "type": "LOAN_APPLICATION",
        "created_by": "5da72bf5df89b700013ac578",
        "disclaimer": "",
        "signatures": [],
        "sections": [],
        "has_sections": false,
        "layout": "THREE_COLUMNS",
        "questions": [],
        "purpose": "A loan application form is used to record loan application details of a client",
        "subtitle": "",
        "title": "Loan Application Form"
    }
 *
 */
router.post('/create', acl(['*']), formController.create);


/**
 * @api {get} /forms/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get forms collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Form
 *
 * @apiDescription Get a collection of forms. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} subtitle Form Subtitle 
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Object[]} questions Form Questions
 * @apiSuccess {String} layout Form Layout i.e TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by User account id who creates the form
 * @apiSuccess {Object[]} sections Form Sections
 * @apiSuccess {Boolean} has_sections true, if Form has Sections
 * @apiSuccess {String} disclaimer Disclaimer
 * @apiSuccess {String[]} signatures Accepted Signatures
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 1,
        "total_docs_count": 4,
        "current_page": 1,
        "docs": [{
            "_id": "5def47b7cda72e00018b528a",
            "last_modified": "2019-12-10T07:22:31.854Z",
            "date_created": "2019-12-10T07:22:31.854Z",
            "type": "LOAN_APPLICATION",
            "created_by": "5da72bf5df89b700013ac578",
            "disclaimer": "",
            "signatures": [],
            "sections": [],
            "has_sections": false,
            "layout": "THREE_COLUMNS",
            "questions": [],
            "purpose": "A loan application form is used to record loan application details of a client",
            "subtitle": "",
            "title": "Loan Application Form"         
        },
        {
            ....
        }
    ]
    }
 */
router.get('/paginate', acl(['*']), formController.fetchAllByPagination);

/**
 * @api {get} /forms/:id/sections Get Form Sections
 * @apiVersion 1.0.0
 * @apiName GetSections
 * @apiGroup Form
 *
 * @apiDescription Get sections of a form with the given id
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {String} number Section Order number
 * @apiSuccess {Object[]} questions Section Questions
 * 
 *
 * @apiSuccessExample Response Example:
 *  [
        {
            "_id": "5b927d6463c2a40001f474e4",
            "number": 1,
            "title": "Economic Activities",            
            "questions": [
                {
                    "_id": "5b927d9f63c2a40001f474e6",
                    ...
                },
                {
                    ...
                }
            ],
            "last_modified": "2018-09-07T13:36:02.448Z",
            "date_created": "2018-09-07T13:30:12.690Z",
            
        },
        {
            "_id": "5b9283fe63c2a40001f47581",
            "last_modified": "2018-09-07T14:21:05.431Z",
            "date_created": "2018-09-07T13:58:22.861Z",
            "questions": [
                ...
            ]
        }
    ]

 
 */
router.get('/:id/sections', acl(['*']), formController.getFormSections);


/**
 * @api {get} /forms/:id Get Form 
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Form
 *
 * @apiDescription Get a form with the given id
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} subtitle Form Subtitle 
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Object[]} questions Form Questions
 * @apiSuccess {String} layout Form Layout i.e TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by User account id who creates the form
 * @apiSuccess {Object[]} sections Form Sections
 * @apiSuccess {Boolean} has_sections true, if Form has Sections
 * @apiSuccess {String} disclaimer Disclaimer
 * @apiSuccess {String[]} signatures Accepted Signatures
 * 
 * 
 * @apiSuccessExample Response Example:
 * 
 * {
        "_id": "5b9270ce63c2a40001f47494",
        "last_modified": "2018-09-07T13:28:43.139Z",
        "date_created": "2018-09-07T12:36:30.037Z",
        "type": "SCREENING",
        "created_by": "5b925494b1cfc10001d80908",
        "disclaimer": "",
        "signatures": [
            "Applicant",
            "Filled By",
            "Checked By"
        ],
        "sections": [],
        "has_sections": false,
        "layout": "THREE_COLUMNS",
        "questions": [
            {
                "_id": "5b92730e63c2a40001f47496",
            },
            {
                ...
            }
        ],
        "purpose": "",
        "subtitle": "",
        "title": "Screening Form/Pre Selection Criteria for Irrigation Input Loan"
    }
 
 *
 *
 */
router.get('/:id', acl(['*']), formController.fetchOne);


/**
 * @api {put} /forms/:id Update Form 
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Form 
 *
 * @apiDescription Update a form with the given id
 * 
 * @apiParam {String} [title] Form Title 
 * @apiParam {String} [subtitle] Form Subtitle
 * @apiParam {String} [purpose] Form Purpose
 * @apiParam {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiParam {String} layout Form's layout i.e 'TWO_COLUMNS' or 'THREE_COLUMNS'. This will determine the layout the form when presented for the user.
 * @apiParam {Boolean} [has_sections] Determines whether the form has sections or not (true or false).
 *

 *
 * @apiParamExample Request example:
 * {
 *      "type": "LOAN_APPLICATION",
        "layout": "THREE_COLUMNS",
        "subtitle": "(Buusaa Gonofaa Microfinance Institute)"
 * } 
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} subtitle Form Subtitle 
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Object[]} questions Form Questions
 * @apiSuccess {String} layout Form Layout i.e TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by User account id who creates the form
 * @apiSuccess {Object[]} sections Form Sections
 * @apiSuccess {Boolean} has_sections true, if Form has Sections
 * @apiSuccess {String} disclaimer Disclaimer
 * @apiSuccess {String[]} signatures Accepted Signatures
 * 
 * 
 * @apiSuccessExample Response Example:
 * 
 * {
    "_id": "5def47b7cda72e00018b528a",
    "last_modified": "2019-12-10T07:49:01.703Z",
    "date_created": "2019-12-10T07:22:31.854Z",
    "type": "LOAN_APPLICATION",
    "created_by": "5da72bf5df89b700013ac578",
    "disclaimer": "",
    "signatures": [],
    "sections": [],
    "has_sections": false,
    "layout": "THREE_COLUMNS",
    "questions": [],
    "purpose": "A loan application form is used to record loan application details of a client",
    "subtitle": "(Buusaa Gonofaa Microfinance Institute)",
    "title": "Loan Application Form"
}

 *
 */
router.put('/:id', acl(['*']), formController.update);

/**
 * @api {delete} /forms/:id Delete Form
 * @apiVersion 1.0.0
 * @apiName DeleteForm
 * @apiGroup Form 
 *
 * @apiDescription Delete a form with the given id
 *
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type i.e SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} subtitle Form Subtitle 
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Object[]} questions Form Questions
 * @apiSuccess {String} layout Form Layout i.e TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by User account id who creates the form
 * @apiSuccess {Object[]} sections Form Sections
 * @apiSuccess {Boolean} has_sections true, if Form has Sections
 * @apiSuccess {String} disclaimer Disclaimer
 * @apiSuccess {String[]} signatures Accepted Signatures
 * 
 *
 * @apiSuccessExample Response Example:
 * {
    "_id": "5def47b7cda72e00018b528a",
    "last_modified": "2019-12-10T07:49:01.703Z",
    "date_created": "2019-12-10T07:22:31.854Z",
    "type": "LOAN_APPLICATION",
    "created_by": "5da72bf5df89b700013ac578",
    "disclaimer": "",
    "signatures": [],
    "sections": [],
    "has_sections": false,
    "layout": "THREE_COLUMNS",
    "questions": [],
    "purpose": "A loan application form is used to record loan application details of a client",
    "subtitle": "(Buusaa Gonofaa Microfinance Institute)",
    "title": "Loan Application Form"
}
 *
 */
router.delete('/:id', acl(['*']), formController.remove);

// Expose Form Router
module.exports = router;
