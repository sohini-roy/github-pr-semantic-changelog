const semver = require('semver')

const tags = require('./get-tags')
console.log(tags);

let tagsVersion = []
for(let i = 0;i <=  tags.length; i++){
  tagsVersion.push(tags[i].name)
}
console.log(tagsVersion)
