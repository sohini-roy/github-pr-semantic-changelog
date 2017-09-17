module.exports = getTags

async function getTags ({github, owner, repo}) {
  const {} = await github.repos.getTags({owner, repo, number})
  return sha
}
