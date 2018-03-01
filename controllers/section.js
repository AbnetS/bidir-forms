'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:section-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const Form              = require('../models/form');
const Section           = require('../models/section');

const TokenDal          = require('../dal/token');
const SectionDal        = require('../dal/section');
const LogDal            = require('../dal/log');
const QuestionDal       = require('../dal/question');
const FormDal           = require('../dal/form');

let hasPermission = checkPermissions.isPermitted('FORM');

/**
 * Create a section.
 *
 * @desc create a section using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createSection(next) {
  debug('create question section');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('title')
      .notEmpty('Section Title is Empty');
  this.checkBody('form')
      .notEmpty('Form Reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let form = yield Form.findOne({ _id: body.form }).exec();
    if(!form) {
      throw new Error('Form Does Not Exist')
    }

    if(!form.has_sections) {
      throw new Error('Form Does Not Need Sections');
    }

    let section = yield SectionDal.get({ title: body.title });
    if(section) {
      throw new Error('Section with that title already exists!!');
    }

    // Create Section Type
    section = yield SectionDal.create(body);

    form = form.toJSON();

    let sections = form.sections.slice();

    sections.push(section._id);

    yield FormDal.update({ _id: form._id },{
      sections: sections
    });
    this.body = section;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single section.
 *
 * @desc Fetch a section with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneSection(next) {
  debug(`fetch section: ${this.params.id}`);


  let query = {
    _id: this.params.id
  };

  try {
    let section = yield SectionDal.get(query);

    yield LogDal.track({
      event: 'view_section',
      section: this.state._user._id ,
      message: `View section - ${section.title}`
    });

    this.body = section;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_SECTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single section.
 *
 * @desc Fetch a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateSection(next) {
  debug(`updating section: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_SECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let section = yield SectionDal.update(query, body);

    yield LogDal.track({
      event: 'section_update',
      section: this.state._user._id ,
      message: `Update Info for ${section.title}`,
      diff: body
    });

    this.body = section;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_SECTION_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of sections by Pagination
 *
 * @desc Fetch a collection of sections
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllSections(next) {
  debug('get a collection of sections by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_SECTIONS_COLLECTION_ERROR',
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
    let sections = yield SectionDal.getCollectionByPagination(query, opts);

    this.body = sections;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_SECTIONS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};


/**
 * Remove a single section.
 *
 * @desc Remove a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeSection(next) {
  debug(`removing section: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };


  try {
    let section = yield SectionDal.delete(query);
    let form    = yield Form.findOne({ _id: this.query.form }).exec();

    if(!section || !section._id) throw new Error('Section Does Not Exist');
    if(!form) throw new Error('Form Does Not Exist');

    if(section.questions) {
      for(let question of section.questions) {
        question = yield QuestionDal.delete({ _id: question._id });

        for(let sub of question.sub_questions) {
          sub = yield QuestionDal.delete({ _id: question._id });
        }
      }
    }

    form = form.toJSON();

    let sections = form.sections.slice();

    _.pull(sections, section._id);

    yield FormDal.update({ _id: form._id },{
      sections: sections
    });

    yield LogDal.track({
      event: 'remove_section',
      section: this.state._user._id ,
      message: `Remove section ${section.title}`
    });

    this.body = section;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_SECTION_ERROR',
      message: ex.message
    }));

  }

};