/* Publications
–––––––––––––––––––––––––––––––––––––––––––––––––– */
/* Publish Collections to client */
/* Code runs only on server */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* Import Projects and Posts collections */
import Projects from '../../api/projects/projects.js';
import Posts from '../../api/posts/posts.js';

Meteor.publish('projects', function () {
  /* only publish projects from current user */
  /* in publications use this.userId instead of Meteor.userId() */
  return Projects.find({ userId: this.userId }, { sort: { createdAt: -1 } });
});

Meteor.publish('projects.current', function (object) {
  /* Check if parameters are of type String */
  new SimpleSchema({
    author: { type: String },
    slug: { type: String },
  }).validate(object);

  const proj = Projects.findOne(object);

  if (!proj) {
    /* Declare that no data is being published */
    return this.ready();
  }

  /* If current user is not owner of private project */
  if (!proj.belongsTo(this.userId) && proj.isPrivate()) {
    return this.ready();
  }

  /* return cursor */
  return Projects.find({ _id: proj._id });
});

/* Publish posts containing projectId */
Meteor.publishComposite('posts.inProject', function (object) {
  /* Check if parameters are of type String */
  new SimpleSchema({
    author: { type: String },
    slug: { type: String },
  }).validate(object);

  const proj = Projects.findOne(object);

  if (!proj) {
    /* Declare that no data is being published */
    return this.ready();
  }

  /* If current user is not owner of private project */
  if (!proj.belongsTo(this.userId) && proj.isPrivate()) {
    return this.ready();
  }

  /* Return two cursors - relational data */
  return {
    find() {
      /* return cursor of top level document */
      return Projects.find({ _id: proj._id });
    },

    children: [
      {
        /* return a cursor of second tier documents */
        find(project) {
          return Posts.find({ projectId: project._id });
        },
      },
    ],
  };
});
