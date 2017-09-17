// module.exports = getTags
const github = require("github");
// async function getTags ({github, owner, repo}) {
let tags = []
tags = await github.repos.getTags({"antarctica", "bas-style-kit"})
console.log(tags);
  // return tags
// }
