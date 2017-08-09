# github-pr-semantic-changelog
load all commits for a given pull request URL and calculate the changelog as well as the type version bump (fix, feature or breaking)

#SYNTAX:
github-set-pr-status <yourGithubUserTokenHere> <pr_URL> <state> <description: optional>

#How it works?

1. fetch commits from PR
2. calculate changelog
3. calculate type version bump (fix, feature or breaking)
4. If there is an invalid commit message, show a summary of how many of the commits could not be parsed
5. Set status to the PR: success(if all commits were according to the convention) or error(if they weren't)
