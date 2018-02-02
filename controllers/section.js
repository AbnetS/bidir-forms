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

const TokenDal          = require('../dal/token');
const SectionDal        = require('../dal/section');
const LogDal            = require('../dal/log');
const QuestionDal       = require('../dal/question');
const FormDal           = require('../dal/form');

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