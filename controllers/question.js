'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:question-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const QUESTION           = require('../lib/enums').QUESTION;
const checkPermissions    = require('../lib/permissions');

const Form              = require('../models/form');
const Section           = require('../models/section');
const Question          = require('../models/question');

const TokenDal           = require('../dal/token');
const QuestionDal        = require('../dal/question');
const LogDal             = require('../dal/log');
const FormDal            = require('../dal/form');
const SectionDal         = require('../dal/section');

let hasPermission = checkPermissions.isPermitted('FORM');

/**
 * Create a  question.
 *
 * @desc create a question using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createQuestion(next) {
  debug('create question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('type')
      .notEmpty('Question Type is Empty')
      .isIn(QUESTION.TYPES, `Question Type should be ${QUESTION.TYPES.join(',')}`);
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'QUESTION_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    let parent;
    if(body.parent_question) {
      parent = yield Question.findOne({ _id: body.parent_question }).exec();
      if(!parent) throw new Error('Parent Question Does Not Exist')
    }

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }


    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'QUESTION_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a Grouped question.
 *
 * @desc create a Grouped question 
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.createGrouped = function* createGroupedQuestion(next) {
  debug('create Grouped question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('validation_factor')
      .empty('Question Validation Factor is Empty')
      .isIn(QUESTION.VALIDATION, `Question Type should be ${QUESTION.VALIDATION.join(',')}`);
  this.checkBody('measurement_unit')
      .empty('Measurement Unit is Empty');
  this.checkBody('required')
      .notEmpty('Question Mandatory value is empty')
      .toBoolean('Required Value is not a boolean value');
  this.checkBody('show')
      .notEmpty('Show Question value is empty')
      .toBoolean('Show Value is not a boolean value');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_GROUPED_QUESTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    /*if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }*/

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    body.type = 'GROUPED';

    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }

    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_GROUPED_QUESTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a FIB question.
 *
 * @desc create a FIB question
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.createFIB = function* createFIBQuestion(next) {
  debug('create Fill In Blanks question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('validation_factor')
      .empty('Question Validation Factor is Empty')
      .isIn(QUESTION.VALIDATION, `Question Type should be ${QUESTION.VALIDATION.join(',')}`);
  this.checkBody('measurement_unit')
      .empty('Measurement Unit is Empty');
  this.checkBody('required')
      .notEmpty('Question Mandatory value is empty')
      .toBoolean('Required Value is not a boolean value');
  this.checkBody('show')
      .notEmpty('Show Question value is empty')
      .toBoolean('Show Value is not a boolean value');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_FIB_QUESTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    /*if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }*/

    let parent;
    if(body.parent_question) {
      parent = yield Question.findOne({ _id: body.parent_question }).exec();
      if(!parent) throw new Error('Parent Question Does Not Exist')
    }

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    if(body.options) {
      throw new Error('Fill in Blank Questions Do not need options');
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    body.type = 'FILL_IN_BLANK';


    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }

    this.body = question;

  } catch(ex) {
    console.log(ex);
    this.throw(new CustomError({
      type: 'CREATE_FIB_QUESTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a Multiple Choice question.
 *
 * @desc create a Multiple Choice question
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.createMC = function* createMultipleChoiceQuestion(next) {
  debug('create Multiple Choice question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('required')
      .empty('Question Mandatory value is empty')
      .toBoolean('Required Value is not a boolean value');
  this.checkBody('options')
      .notEmpty('Question Options is empty');
  this.checkBody('show')
      .notEmpty('Show Question value is empty')
      .toBoolean('Show Value is not a boolean value');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_MC_QUESTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    /*if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }*/

    let parent;
    if(body.parent_question) {
      parent = yield Question.findOne({ _id: body.parent_question }).exec();
      if(!parent) throw new Error('Parent Question Does Not Exist')
    }

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    body.type = 'MULTIPLE_CHOICE';

    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }

    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_MC_QUESTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a Single Choice question.
 *
 * @desc create a Single Choice question 
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.createSC = function* createSingleChoiceQuestion(next) {
  debug('create Single Choice question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('required')
      .empty('Question Mandatory value is empty')
      .toBoolean('Required Value is not a boolean value');
  this.checkBody('options')
      .notEmpty('Question Options is empty');
  this.checkBody('show')
      .notEmpty('Show Question value is empty')
      .toBoolean('Show Value is not a boolean value');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_SC_QUESTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    /*if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }*/

    let parent;
    if(body.parent_question) {
      parent = yield Question.findOne({ _id: body.parent_question }).exec();
      if(!parent) throw new Error('Parent Question Does Not Exist')
    }

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    body.type = 'SINGLE_CHOICE';
    
    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }

    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_SC_QUESTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a Yes/No question.
 *
 * @desc create a Yes/No Choice question 
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.createYN = function* createYNQuestion(next) {
  debug('create Yes/No question');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('required')
      .empty('Question Mandatory value is empty')
      .toBoolean('Required Value is not a boolean value');
  this.checkBody('show')
      .notEmpty('Show Question value is empty')
      .toBoolean('Show Value is not a boolean value');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');
  this.checkBody('number')
      .notEmpty('Question Number is Empty ie 1,2,2.2,3,3.1');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_SC_QUESTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let question;
    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Question Form Does Not Exist')
    }

    /*if(!body.parent_question) {
      question = yield QuestionDal.get({ question_text: body.question_text });
      if(question) {
        throw new Error('Question with that title already exists!!');
      }
    }*/

    let parent;
    if(body.parent_question) {
      parent = yield Question.findOne({ _id: body.parent_question }).exec();
      if(!parent) throw new Error('Parent Question Does Not Exist')
    }

    let section;
    if(body.section) {
      section = yield Section.findOne({ _id: body.section }).exec();
      if(!section) throw new Error('Section Does Not Exist')
    }

    if(!body.show && !body.prerequisites) throw new Error('Question Requires Prerequisites');

    body.type = 'YES_NO';

    // Create Question Type
    question = yield QuestionDal.create(body);

    if(body.parent_question) {
      parent = parent.toJSON();

      let subQuestions = parent.sub_questions.slice();

      subQuestions.push(question._id);

      yield QuestionDal.update({ _id: parent._id },{
        sub_questions: subQuestions
      });
    } else if(body.section) {
      section = section.toJSON();

      let questions = section.questions.slice();

      questions.push(question._id);

      yield SectionDal.update({ _id: section._id },{
        questions: questions
      });

    } else {
      form = form.toJSON();

      let questions = form.questions.slice();

      questions.push(question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });

    }

    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_YN_QUESTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single question.
 *
 * @desc Fetch a question with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneQuestion(next) {
  debug(`fetch question: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let question = yield QuestionDal.get(query);

    if(!question || !question._id) {
      throw new Error('Question Does not Exist!!');
    }

    yield LogDal.track({
      event: 'view_question',
      question: this.state._user._id ,
      message: `View question - ${question.title}`
    });

    this.body = question;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'QUESTION_RETRIEVAL_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Update a single question.
 *
 * @desc Fetch a question with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateQuestion(next) {
  debug(`updating question: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let question = yield QuestionDal.get(query);
    if(!question || !question._id) {
      throw new Error('Question Does not Exist!!');
    }

    question = yield QuestionDal.update(query, body);

    yield LogDal.track({
      event: 'question_update',
      question: this.state._user._id ,
      message: `Update Info for ${question.question_text}`,
      diff: body
    });

    this.body = question;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_QUESTION_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of questions by Pagination
 *
 * @desc Fetch a collection of questions
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllQuestions(next) {
  debug('get a collection of questions by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_QUESTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = -1) : (sort.date_created = -1 );

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {
    let questions = yield QuestionDal.getCollectionByPagination(query, opts);

    this.body = questions;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_QUESTIONS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single question.
 *
 * @desc Fetch a question with the given id from the database
 *       and remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeQuestion(next) {
  debug(`removing question: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {

    let question = yield QuestionDal.get(query);
    if(!question) {
      throw new Error('Question Does not Exist!!');
    }

    question = yield QuestionDal.delete(query);

    // remove from parent question
    if(this.query.parent_question) {
      let parent = yield Question.findOne({ _id: this.query.parent_question }).exec();

      let subQquestions = parent.sub_questions.slice();

      _.pull(subQquestions, question._id);

      yield QuestionDal.update({ _id: parent._id },{ sub_questions: subQquestions })

    } else {
      if(!this.query.form) {
        throw new Error('Form reference missing in query');
      }

      let form = yield Form.findOne({ _id: this.query.form }).exec();
      if(!form) {
        throw new Error(' Form Does Not Exist')
      }
      
      form = form.toJSON();
    
      // Remove from Form
      let questions = form.questions.slice();

      _.pull(questions, question._id);

      yield FormDal.update({ _id: form._id },{
        questions: questions
      });


      // Remove from sections
      let sections = form.sections.slice();
      for(let section of sections) {
        // Remove from Form
        section = yield Section.findOne({ _id: section }).exec();
        if(!section) continue;

        let questions = section.questions.slice();

        _.pull(questions, question._id);

        yield SectionDal.update({ _id: section._id },{ questions: questions })
      }

    }


    yield LogDal.track({
      event: 'question_remove',
      question: this.state._user._id ,
      message: `Remove question with title ${question.question_text}`
    });

    this.body = question;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_QUESTION_ERROR',
      message: ex.message
    }));

  }

};
