import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Projects from '../../api/projects/projects.js'; // Posts Collection
import Posts from '../../api/posts/posts.js'; // Posts Collection

/* Import template */
import './planet.html';

/* Subscribe to Posts Collections */
Template.Planet_page.onCreated(function () {
  this.getProjectId = () => FlowRouter.getParam('projectId');

  /* Subscribe to posts.inProject publication based on projectId FlowRouter param */
  this.autorun(() => {
    /* this.subscribe instead of Meteor.subscribe -> enables {{Template.subscriptionsReady}} */
    this.subscribe('posts.inProject', this.getProjectId(), () => {
      /* When project does not exists or is private */
      if (Projects.find().count() === 0) {
        FlowRouter.go('/notfound');
      }
    });
  });
});

Template.Planet_page.helpers({
  posts() {
    return Posts.find({});
  },
  projectName() {
    const project = Projects.findOne();
    return project.name;
  },
});
