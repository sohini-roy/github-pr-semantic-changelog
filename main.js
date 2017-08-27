#!/usr/bin/env node

'use strict'

var standardChangelog = require('standard-changelog')
var gitSemverTags = require('git-semver-tags')
var conventionalRecommendedBump = require('conventional-recommended-bump')
var validateMessage = require('validate-commit-msg')
var GitHubApi = require('github')
var github = new GitHubApi({
  version: '3.0.0'
})

function createStatus () {
  var argv = require('minimist')(process.argv.slice(2))
  // console.log(argv);
  var invalidCommits = 0
  var inputString = argv
  var userToken = inputString._[0]
  var repoUrl = inputString._[1].split('/')
  var repoOwner = repoUrl[3]
  var repository = repoUrl[4]
  var pullRequestNumber = repoUrl[6]
  var createStatusInput = {
    'owner': repoOwner,
    'repo': repository,
    'sha': '',
    'state': '',
    'description': ''
  }
  var input = {
    'owner': repoOwner,
    'repo': repository,
    'number': pullRequestNumber
  }

  github.authenticate({
    type: 'token',
    token: userToken
  })

  getSha()

  function getSha () {
    github.pullRequests.get(
        input,
        function (err, res) {
          if (err) {
            console.log('pullRequests get error')
            console.log(err)
          }
          if (res) {
            console.log('pullRequests get response')
            createStatusInput.sha = res.data.head.sha
            getCommits()
          }
        }
      )
  }

  function getCommits () {
    github.pullRequests.getCommits(
      input,
      function (err, res) {
        // console.log(input);
        if (err) {
          console.log('error')
          console.log(err)
          return
        }
        if (res) {
          for (var i = 0; i < res.data.length; i++) {
            console.log(res.data[i].commit.message)
            var valid = validateMessage(res.data[i].commit.message)
            console.log(valid)
            // if(valid){
            //   invalidCommits += 1;
            //   console.log("invalid");
            // }
          }

          if (invalidCommits) {
            createStatusInput.description = invalidCommits + '/' + res.data.length + ' commit messages are invalid'
            createStatusInput.state = 'error'
            github.repos.createStatus(
              createStatusInput,
              function (err, res) {
                if (err) {
                  console.log('createStatus error')
                  console.log(err)
                }
                if (res) {
                  console.log('createStatus response')
                  console.log(res)
                }
              }
            )
          }

          if (!invalidCommits) {
            console.log('No invalid commits')
            createStatusInput.state = 'success'
            github.repos.createStatus(
              createStatusInput,
              function (err, res) {
                if (err) {
                  console.log('createStatus error')
                  console.log(err)
                }
                if (res) {
                  console.log('createStatus response')
                  console.log(res)
                }
              }
            )
          }

          conventionalRecommendedBump({
            preset: 'angular'
          },
          function (err, result) {
            if (err) {
              console.log('conventionalRecommendedBump error')
              console.log(err)
              return
            }
            if (result) {
              console.log('conventionalRecommendedBump response')
              console.log(result.releaseType)
              gitSemverTags(function (err, tags) {
                if (err) {
                  console.log('git semver error')
                  console.log(err)
                  return
                }
                if (tags) {
                  console.log(tags)
                  standardChangelog().pipe(process.stdout)
                }
              })
            }
          })
        }
      }
    )
  }
}

createStatus()
