'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:form-router');

const formController  = require('../controllers/form');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /forms/create Create new Form
 * @apiVersion 1.0.0
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiDescription Create new Form. 
 *
 * @apiParam {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiParam {String} subtitle Form Subtitle
 * @apiParam {String} purpose Form Purpose
 * @apiParam {String} title Form Title
 *
 * @apiParamExample Request Example:
 *  {
 *    type: "SCREENING",
 *    subtitle: "Subtitle",
 *    title: "Title",
 *    purpose: "To Vet Clients",
 *  }
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} subtitle Form Subtitle
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} layout Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Array} sections Form Sections
 * @apiSuccess {Boolean} has_sections If Form has Sections
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "SCREENING",
 *    subtitle: "Subtitle",
 *    title: "Title",
 *    purpose: "To Vet Clients",
 *    questions: ]{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    },
 *    has_sections: false,
 *    sections: [],
 *    layout: 'TWO_COLUMNS'
 *  }
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
 * @apiSuccess {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} subtitle Form Subtitle
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} layout Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Array} sections Form Sections
 * @apiSuccess {Boolean} has_sections If Form has Sections
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      _id : "556e1174a8952c9521286a60",
 *      type: "SCREENING",
 *      subtitle: "Subtitle",
 *      title: "Title",
 *      purpose: "To Vet Clients",
 *      questions: ]{
 *        _id : "556e1174a8952c9521286a60",
 *        ....
 *      }],
 *      created_by: {
 *        _id : "556e1174a8952c9521286a60",
 *        ....
 *      },
 *      has_sections: false,
 *      sections: [],
 *      layout: 'TWO_COLUMNS'
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), formController.fetchAllByPagination);

/**
 * @api {get} /forms/:id Get Form Form
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Form
 *
 * @apiDescription Get a user form with the given id
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} subtitle Form Subtitle
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} layout Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Array} sections Form Sections
 * @apiSuccess {Boolean} has_sections If Form has Sections
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
  *    type: "SCREENING",
 *    subtitle: "Subtitle",
 *    title: "Title",
 *    purpose: "To Vet Clients",
 *    questions: ]{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    },
 *    has_sections: false,
 *    sections: [],
 *    layout: 'TWO_COLUMNS'
 *  }
 *
 *
 */
router.get('/:id', acl(['*']), formController.fetchOne);


/**
 * @api {put} /forms/:id Update Form Form
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Form 
 *
 * @apiDescription Update a Form form with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "Form Title"
 * }
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} subtitle Form Subtitle
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} layout Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Array} sections Form Sections
 * @apiSuccess {Boolean} has_sections If Form has Sections
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
  *    type: "SCREENING",
 *    subtitle: "Subtitle",
 *    title: "Form Title",
 *    purpose: "To Vet Clients",
 *    questions: ]{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    },
 *    has_sections: false,
 *    sections: [],
 *    layout: 'TWO_COLUMNS'
 *  }
 *
 */
router.put('/:id', acl(['*']), formController.update);

/**
 * @api {delete} /forms/:id Delete Form
 * @apiVersion 1.0.0
 * @apiName DeleteForm
 * @apiGroup Form 
 *
 * @apiDescription Delete a Form form with the given id
 *
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie SCREENING or LOAN_APPLICATION
 * @apiSuccess {String} subtitle Form Subtitle
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} purpose Form Purpose
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} layout Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Array} sections Form Sections
 * @apiSuccess {Boolean} has_sections If Form has Sections
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
  *    type: "SCREENING",
 *    subtitle: "Subtitle",
 *    title: "Title",
 *    purpose: "To Vet Clients",
 *    questions: ]{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    },
 *    has_sections: false,
 *    sections: [],
 *    layout: 'TWO_COLUMNS'
 *  }
 *
 */
router.delete('/:id', acl(['*']), formController.remove);

// Expose Form Router
module.exports = router;
