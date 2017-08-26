module.exports = getCommits

const commitParser = require('conventional-commits-parser')

async function getCommits ({github, owner, repo, number}) {
  // https://developer.github.com/v3/pulls/#list-commits-on-a-pull-request
  const result = await github.pullRequests.getCommits({owner, repo, number})
  const messages = result.data.map(row => row.commit.message)

  const stream = commitParser()
  const parsedCommits = []
  stream.on('data', (parsedCommit) => {
    parsedCommits.push(parsedCommit)
  })
  messages.forEach(stream.write.bind(stream))
  stream.end()

  return parsedCommits
}
