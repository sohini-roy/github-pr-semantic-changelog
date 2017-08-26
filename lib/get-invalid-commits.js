module.exports = getInvalidCommits

function getInvalidCommits (commits) {
  return commits.filter(commit => commit.type === null)
}
