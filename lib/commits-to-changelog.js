module.exports = commitsToChangelog

const changelogWriter = require('conventional-changelog-writer')

function commitsToChangelog (commits) {
  let changelog = ''
  const stream = changelogWriter()
    .on('data', chunk => {
      changelog += chunk.toString()
    })

  commits.forEach(stream.write.bind(stream))
  stream.end()
  return changelog.split(/\n/).slice(2).join('\n').trim()
}
