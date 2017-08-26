module.exports = getSha

async function getSha ({github, owner, repo, number}) {
  const {data: {head: {sha}}} = await github.pullRequests.get({owner, repo, number})
  return sha
}
