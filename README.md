# marp-team/actions

Common [GitHub Actions] and scripts for [Marp team](https://github.com/marp-team) projects.

```yaml
jobs:
  something:
    steps:
      - uses: marp-team/actions@v1
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

Please note that provided actions are only for Marp team projects.

[github actions]: https://github.com/features/actions

## [GitHub Actions]

Pass the name of task to `task` parameter in `with` key of the step.

### `release`: Update GitHub Release

Update GitHub Release for the tagged version based on parsed contents from `CHANGELOG.md`.

```yaml
on:
  push:
    tags:
      - v*

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: marp-team/actions@v1
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

#### Inputs

- `task` (required): Must be `release`.
- `token` (required): GitHub token.

## `npm version` helper script

This repository also provides a helper script of `npm version` for including update of `CHANGELOG.md` to bumped commit.

```javascript
// package.json
{
  "scripts": {
    "version": "curl https://raw.githubusercontent.com/marp-team/actions/v1/lib/scripts/version.js | node && git add -A CHANGELOG.md"
  }
}
```

## Development

### Release

`vX.X.X-release` tag for production use will [create automatically](.github/workflows/release.yml) when pushed a semantic versioning tag such as `vX.X.X`. It includes compiled JS scripts and dependent modules for production.

## Author

Managed by [@marp-team](https://github.com/marp-team).

## License

[MIT License](LICENSE)
