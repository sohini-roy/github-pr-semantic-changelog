#!/usr/bin/env node

"use strict";

var standardChangelog = require('standard-changelog');
var gitSemverTags = require('git-semver-tags');
var conventionalGithubReleaser = require('conventional-github-releaser');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var validateMessage = require('validate-commit-msg');
var GitHubApi   = require('github');
var githubTokenUser = require('github-token-user');
var github = new GitHubApi({
  version: '3.0.0'
});

function createStatus() {
  var argv = require('minimist')(process.argv.slice(2));
  var invalidCommits = 0;
  var inputString = argv;
  var user_token = inputString._[0];
  var version = inputString._[2].split(':');
  var semver = version[1];
  var repo_url = inputString._[1].split('/');
  var repoOwner = repo_url[3];
  var repository = repo_url[4];
  var pullRequestNumber = repo_url[6];
  var createStatusInput = {
    'owner': repoOwner,
    'repo': repository,
    'sha': '',
    'state': ''
  }
  var input = {
    'owner': repoOwner,
    'repo' : repository,
    'number' : pullRequestNumber
  }
  var AUTH = {
    type: 'oauth',
    token: user_token
  };
  var reviewInput = {
    'owner': repoOwner,
    'repo' : repository,
    'number' : pullRequestNumber,
    'comments':''
  }

  githubTokenUser(user_token).then(data => {
    // console.log(data);
    github.authenticate({
      type: "token",
      token: user_token
    });
    github.pullRequests.get(
      input,
      function(err, res){
        if(err){
          console.log("pullRequests get error");
          console.log(err);
        }
        if(res){
          console.log("pullRequests get response");
          createStatusInput.sha = res.data.head.sha;
        }
      }
      getCommits();
    );
  });


  function getCommits() {
    github.pullRequests.getCommits(
      input,
      function(err, res){
        // console.log(input);
        if(err){
          console.log("error");
          console.log(err);
          return ;
        }
        if(res){
          for( var i = 0; i<res.data.length; i++) {
            console.log(res.data[i].commit.message);
            var valid = validateMessage(res.data[i].commit.message);
            if(valid){ invalidCommits += 1; }
          }

          if(invalidCommits){
            reviewInput.comments = invalidCommits + '/' + res.data.length + ' commit messages are invalid';
            github.pullRequests.createReview(
              reviewInput,
              function(err, res){
                if(err){
                  console.log("createReview error");
                  console.log(err);
                }
                if(res){
                  console.log("createReview result");
                  createStatusInput.state = 'error'
                  github.repos.createStatus(
                    createStatusInput,
                    function(err, res){
                      if(err){
                        console.log("createStatus error");
                        console.log(err);
                      }
                      if(res){
                        console.log("createStatus response");
                        console.log(res);
                      }
                    }
                  );
                }
              }
            );
          }

          if(!invalidCommits){
            console.log("No invalid commits");
            createStatusInput.state = 'success'
            github.repos.createStatus(
              createStatusInput,
              function(err, res){
                if(err){
                  console.log("createStatus error");
                  console.log(err);
                }
                if(res){
                  console.log("createStatus response");
                  console.log(res);
                }
              }
            );
          }

          conventionalRecommendedBump({
            preset: 'angular'
          },
          function(err, result) {
            if(err){
              console.log('conventionalRecommendedBump error');
              console.log(err);
              return ;
            }
            if(result){
              console.log("conventionalRecommendedBump response");
              console.log(result.releaseType);
              gitSemverTags(function(err, tags) {
                if(err){
                  console.log("git semver error");
                  console.log(err);
                  return ;
                }
                if(tags){
                  console.log(tags);
                  standardChangelog()
                    .pipe(process.stdout);
                }
              });
            }
          });
        }
      }
    );
  }
}

createStatus();
