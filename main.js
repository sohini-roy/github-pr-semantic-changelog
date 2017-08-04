#!/usr/bin/env node

"use strict";

var conventionalGithubReleaser = require('conventional-github-releaser');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var validateMessage = require('validate-commit-msg');
var GitHubApi   = require('github');
var githubTokenUser = require('github-token-user');
var github      = new GitHubApi({
  version: '3.0.0'
});

function createStatus() {
  var argv = require('minimist')(process.argv.slice(2));
  var inputString = argv;
  var user_token = inputString._[0];
  var state = inputString._[2];
  var repo_url = inputString._[1].split('/');
  var repoOwner = repo_url[3];
  var repository = repo_url[4];
  var pullRequestNumber = repo_url[6];
  var input = {
    'owner': repoOwner,
    'repo' : repository,
    'number' : pullRequestNumber
  }
  var AUTH = {
    type: 'oauth',
    token: user_token
  };

  githubTokenUser(user_token).then(data => {
      // console.log(data);
      github.authenticate({
        type: "token",
        token: user_token
      });
      getCommits();
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
          var invalid_commits = [];

          for( var i = 0; i<res.data.length; i++){
            console.log(res.data[i].commit.message);

            var logBackup = console.log;
            var logMessages = [];
            console.log = function() {
                logMessages.push.apply(logMessages, arguments);
                logBackup.apply(console, arguments);
            };

            var valid = validateMessage(res.data[i].commit.message);

            if(logMessages[0].length != 0){
                invalid_commits[i] = logMessages[0];
                console.log("Invalid Commit = "+invalid_commits[i]+" at ="+i);
            }


          }
          conventionalRecommendedBump({
            preset: 'angular'
          },
          function(err, result) {
            if(err){
              console.log('conventionalRecommendedBump error');
              console.log(err);
            }
            if(result){
              console.log("conventionalRecommendedBump response");
              console.log(result.releaseType);
              conventionalGithubReleaser(AUTH, {
                preset: 'angular'
              },
              function(err, res){
                if(err){
                  console.log("conventionalGithubReleaser error");
                  console.log(err);
                }
                if(res){
                  console.log("conventionalGithubReleaser response");
                  console.log(res);
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
