# marp-team/actions

Common [GitHub Actions](https://github.com/features/actions) for [Marp team](https://github.com/marp-team) projects.

```yaml
jobs:
  something:
    steps:
      - uses: marp-team/actions@v0.1.0-release
        with:
          task: release
```

Please note that provided actions are only for Marp team projects.

## Tasks

Pass the name of task to `task` parameter in `with` key of the step.

### [WIP] `release`: Update GitHub releases

Parse change logs from `CHANGELOG.md` and update GitHub releases.

## Release

`vX.X.X-release` tag for production use will [create automatically](.github/workflows/release.yml) when pushed a semantic versioning tag such as `vX.X.X`. It includes compiled JS scripts and dependent modules for production.

## Author

Managed by [@marp-team](https://github.com/marp-team).

## License

[MIT License](LICENSE)
