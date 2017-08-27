#!/usr/bin/env node

const minimist = require('minimist')

const createStatus = require('../index')

const argv = minimist(process.argv.slice(2))
const userToken = argv.userToken
const repoUrl = argv._[0].split('/')
const repoOwner = repoUrl[3]
const repository = repoUrl[4]
const pullRequestNumber = repoUrl[6]

createStatus({
  userToken,
  repoUrl,
  repoOwner,
  repository,
  pullRequestNumber
})

.then(({commits, invalidCommits, changelog}) => {
  if (invalidCommits.length > 1) {
    console.log(`Error: Could not parse ${invalidCommits.length}/${commits.length} commits:`)
    invalidCommits.forEach((commit, i) => {
      console.log(`${i + 1}. ${commit.header}`)
    })
    return
  }

  console.log(changelog)
})

.catch(console.log)

process.on('unhandledRejection', console.log)
