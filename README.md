# marp-team/actions

Common [GitHub Actions](https://github.com/features/actions) for [Marp team](https://github.com/marp-team) projects.

```yaml
jobs:
  something:
    steps:
      - uses: marp-team/actions@v0.1.0-release
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

Please note that provided actions are only for Marp team projects.

## Tasks

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
      - uses: marp-team/actions@v0.1.0-release
        with:
          task: release
          token: ${{ secrets.GITHUB_TOKEN }}
```

#### Inputs

- `task` (required): Must be `release`.
- `token` (required): GitHub token.

## Development

### Release

`vX.X.X-release` tag for production use will [create automatically](.github/workflows/release.yml) when pushed a semantic versioning tag such as `vX.X.X`. It includes compiled JS scripts and dependent modules for production.

## Author

Managed by [@marp-team](https://github.com/marp-team).

## License

[MIT License](LICENSE)
