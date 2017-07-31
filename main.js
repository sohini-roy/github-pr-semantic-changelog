#!/usr/bin/env node

"use strict";

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

  githubTokenUser(user_token).then(data => {
      console.log(data);
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
        console.log(input);
        if(err){
          console.log("error");
          console.log(err);
          return ;
        }
        if(res){
          console.log("response");
          console.log(res);
        }
      }
    );
  }
}

createStatus();
