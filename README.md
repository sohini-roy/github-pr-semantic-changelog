# github-pr-semantic-changelog

> Load PR commits and calculate changelog and version bump

# Usage

```shell
github-pr-semantic-changelog <PR URL> [--token <GitHub token>]
```

Example without authentication

```shell
github-pr-semantic-changelog https://github.com/hoodiehq/hoodie/pull/678
```

Example with authentication

```shell
github-pr-semantic-changelog --token 0123456789abcdef0123456789abcdef01234567 https://github.com/hoodiehq/hoodie/pull/678
```

# How does it work

1. Fetch commits from PR
2. Get `sha` of the PR
3. If there is an invalid commit message, show a summary of how many of the commits could not be parsed
4. Calculate the type of version bump (fix, feature or breaking)
5. Set status to the PR: success (if all commits were according to the convention) or error (if they weren't)
6. Calculate next-version based on pre-release
