var CLI         = require('clui');
var inquirer    = require('inquirer');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var request     = require('request');
var files       = require('./lib/files');
var githubTokenUser = require('github-token-user');
var github      = new GitHubApi({
  version: '3.0.0'
});

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
