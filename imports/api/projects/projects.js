/* Projects Collection
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Tool to export Collections to window -> Makes debugging in Browser possible */
import { exportClient } from 'export-client';

/* ES6 defaut export */
const Projects = new Mongo.Collection('projects');
export default Projects;

/* Validation Schema definition */
Projects.schema = new SimpleSchema({
  _id: {
    type: String,
     /* Regular Expression must be matched */
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  author: {
    type: String,
  },
  name: {
    type: String,
    max: 32,
  },
  slug: {
    type: String,
  },
  public: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
  },
});

Projects.attachSchema(Projects.schema);

/* dburles:collection-helpers */
Projects.helpers({
  belongsTo(userId) {
    /* this refers to project document */
    return this.userId === userId;
  },
  isPrivate() {
    return !this.public;
  },
});

/* When in development attach variable to window object (debugging) */
if (Meteor.isDevelopment) {
  exportClient({ Projects });
}
