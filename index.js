module.exports = createStatus

const GitHubApi = require('github')

const getSha = require('./lib/get-sha')
const getCommits = require('./lib/get-commits')
const getInvalidCommits = require('./lib/get-invalid-commits')
const toChangelog = require('./lib/commits-to-changelog')

const github = new GitHubApi({
  version: '3.0.0'
})

async function createStatus ({userToken, repoUrl, repoOwner, repository, pullRequestNumber}) {
  const createStatusInput = {
    owner: repoOwner,
    repo: repository,
    sha: '',
    state: '',
    description: ''
  }

  if (userToken) {
    github.authenticate({
      type: 'token',
      token: userToken
    })
  }

  const sha = await getSha({
    github,
    owner: repoOwner,
    repo: repository,
    number: pullRequestNumber
  })
  createStatusInput.sha = sha
  const commits = await getCommits({
    github,
    owner: repoOwner,
    repo: repository,
    number: pullRequestNumber
  })
  const invalidCommits = await getInvalidCommits(commits)
  const changelog = await toChangelog(commits)

  // TODO
  // 1. load all git tags from GitHub
  // 2. find all version tags (1.2.3 or prefixed with a "v" like v1.2.3), see semver package
  // 3. find the highest version number from the tags
  // 4. use the version number to calculate next version number and  use it in the changelogs
  //    and pass it to the result object

  return {
    commits,
    invalidCommits,
    changelog
  }
}
