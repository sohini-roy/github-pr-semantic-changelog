#!/usr/bin/env node

const standardChangelog = require('standard-changelog')
const gitSemverTags = require('git-semver-tags')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const validateMessage = require('validate-commit-msg')
const GitHubApi = require('github')

const github = new GitHubApi({
  version: '3.0.0'
})

function createStatus () {
  const argv = require('minimist')(process.argv.slice(2))
  const userToken = argv._[0]
  const repoUrl = argv._[1].split('/')
  const repoOwner = repoUrl[3]
  const repository = repoUrl[4]
  const pullRequestNumber = repoUrl[6]
  const createStatusInput = {
    owner: repoOwner,
    repo: repository,
    sha: '',
    state: '',
    description: ''
  }
  const input = {
    owner: repoOwner,
    repo: repository,
    number: pullRequestNumber
  }

  let invalidCommits = 0

  github.authenticate({
    type: 'token',
    token: userToken
  })

  getSha()

  function getSha () {
    github.pullRequests.get(
        input,
        function (error, result) {
          if (error) {
            console.log('pullRequests get error')
            console.log(error)
            return
          }

          console.log('pullRequests get response')
          createStatusInput.sha = result.data.head.sha
          getCommits()
        }
      )
  }

  function getCommits () {
    github.pullRequests.getCommits(
      input,
      function (error, result) {
        if (error) {
          console.log('error')
          console.log(error)
          return
        }

        for (let i = 0; i < result.data.length; i++) {
          console.log(result.data[i].commit.message)
          const valid = validateMessage(result.data[i].commit.message)
          console.log(valid)
          // if(valid){
          //   invalidCommits += 1;
          //   console.log("invalid");
          // }
        }

        if (invalidCommits) {
          createStatusInput.description = `${invalidCommits}/${result.data.length} commit messages are invalid`
          createStatusInput.state = 'error'
          github.repos.createStatus(
            createStatusInput,
            function (error, res) {
              if (error) {
                console.log('createStatus error')
                console.log(error)
                return
              }

              console.log('createStatus response')
              console.log(res)
            }
          )
        }

        if (!invalidCommits) {
          console.log('No invalid commits')
          createStatusInput.state = 'success'
          github.repos.createStatus(
            createStatusInput,
            function (error, result) {
              if (error) {
                console.log('createStatus error')
                console.log(error)
                return
              }

              console.log('createStatus response')
              console.log(result)
            }
          )
        }

        conventionalRecommendedBump({
          preset: 'angular'
        },
        function (error, result) {
          if (error) {
            console.log('conventionalRecommendedBump error')
            console.log(error)
            return
          }

          console.log('conventionalRecommendedBump response')
          console.log(result.releaseType)
          gitSemverTags(function (error, tags) {
            if (error) {
              console.log('git semver error')
              console.log(error)
              return
            }

            if (tags) {
              console.log(tags)
              standardChangelog().pipe(process.stdout)
            }
          })
        })
      }
    )
  }
}

createStatus()
