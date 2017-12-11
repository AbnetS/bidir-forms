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

const TokenDal           = require('../dal/token');
const QuestionDal          = require('../dal/question');
const LogDal             = require('../dal/log');


/**
 * Create a question.
 *
 * @desc create a question using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createQuestion(next) {
  debug('create question');

  let body = this.request.body;

  this.checkBody('question_text')
      .notEmpty('Question Title is Empty');
  this.checkBody('type')
      .notEmpty('Question Type is Empty')
      .isIn(['Yes/No', 'Fill In Blank', 'Multiple Choice'], 'Question Type should be Yes/No, Fill In Blank, or Multiple Choice');
  this.checkBody('required')
      .notEmpty('Question Required value is Empty')
      .isIn([true, false], 'Question Required value should be true or false');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'QUESTION_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    if(body.type === 'Fill In Blank' && body.options) {
      throw new Error('Fill in Blank Questions Do not need options');
    }

    if(body.type === 'Multiple Choice' && !body.options) {
      throw new Error('Multiple Choice Questions need options');
    }

    let question = yield QuestionDal.get({ question_text: body.question_text });
    if(question) {
      throw new Error('Question with that title already exists!!');
    }

    // Create Question Type
    question = yield QuestionDal.create(body);

    this.body = question;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'QUESTION_CREATION_ERROR',
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
 * Update Question Status
 *
 * @desc Fetch a question with the given ID and update their respective status.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateStatus = function* updateQuestion(next) {
  debug(`updating status question: ${this.params.id}`);

  this.checkBody('is_active')
      .notEmpty('is_active should not be empty');

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let question = yield QuestionDal.update(query, body);

    yield LogDal.track({
      event: 'question_status_update',
      question: this.state._user._id ,
      message: `Update Status for ${question.title}`,
      diff: body
    });

    this.body = question;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'QUESTION_STATUS_UPDATE_ERROR',
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

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let question = yield QuestionDal.get(query);
    if(!question || !question._id) {
      throw new Error('Question Does not Exist!!');
    }

    if(body.options.length) {
      if(question.type === 'Fill In Blank') {
        throw new Error('Fill in Blank Questions Do not need options');
      }
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