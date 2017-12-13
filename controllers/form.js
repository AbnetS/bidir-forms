'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:form-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const TokenDal           = require('../dal/token');
const FormDal          = require('../dal/form');
const LogDal             = require('../dal/log');
const QuestionDal      = require('../dal/question');

let hasPermission = checkPermissions.isPermitted('FORM');

/**
 * Create a form.
 *
 * @desc create a form using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createForm(next) {
  debug('create form');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('type')
      .notEmpty('Form Type is Empty')
      .isIn(['Screening', 'Loan Application', 'Group Application', 'ACAT'], 'Accepted Form Types are Screening, Loan Application, Group Application and ACAT');
  this.checkBody('title')
      .notEmpty('Form Title is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_FORM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let form = yield FormDal.get({ type: body.type });
    if(form) {
      throw new Error('Form For that type already exists!!');
    }
    // Create Form Type
    form = yield FormDal.create(body);

    this.body = form;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_FORM_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single form.
 *
 * @desc Fetch a form with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneForm(next) {
  debug(`fetch form: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'GET_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let form = yield FormDal.get(query);

    yield LogDal.track({
      event: 'view_form',
      form: this.state._user._id ,
      message: `View form - ${form.title}`
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_FORM_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single form.
 *
 * @desc Fetch a form with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateForm(next) {
  debug(`updating form: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let form = yield FormDal.update(query, body);

    yield LogDal.track({
      event: 'form_update',
      form: this.state._user._id ,
      message: `Update Info for ${form.title}`,
      diff: body
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_FORM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of forms by Pagination
 *
 * @desc Fetch a collection of forms
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllForms(next) {
  debug('get a collection of forms by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_FORMS_COLLECTION_ERROR',
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
    let forms = yield FormDal.getCollectionByPagination(query, opts);

    this.body = forms;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_FORMS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single form.
 *
 * @desc Fetch a form with the given id from the database
 *       and Remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeForm(next) {
  debug(`removing screening: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let form = yield FormDal.delete(query);
    if(!form._id) {
      throw new Error('Form Does Not Exist!');
    }

    for(let question of form.questions) {
      question = yield QuestionDal.delete({ _id: question._id });
      if(question.sub_question.length) {
        for(let _question of question.sub_questions) {
          yield QuestionDal.delete({ _id: _question._id });
        }
      }
    }

    yield LogDal.track({
      event: 'form_delete',
      permission: this.state._user._id ,
      message: `Delete Info for ${form._id}`
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_FORM_ERROR',
      message: ex.message
    }));

  }

};