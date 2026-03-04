# Release Process

Releases are fully automated using [release-please](https://github.com/googleapis/release-please) and GitHub Actions.

## How It Works

### 1. Conventional Commits

Every commit to `main` must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

| Prefix                                  | Meaning         | Version Bump           |
| --------------------------------------- | --------------- | ---------------------- |
| `fix:`                                  | Bug fix         | Patch (1.0.0 -> 1.0.1) |
| `feat:`                                 | New feature     | Minor (1.0.0 -> 1.1.0) |
| `feat!:` or `BREAKING CHANGE:`          | Breaking change | Major (1.0.0 -> 2.0.0) |
| `chore:`, `docs:`, `refactor:`, `test:` | Non-user-facing | No release             |

Commitlint enforces this format via a git hook on every commit.

### 2. Release-Please Creates PRs

On every push to `main`, the Release workflow runs. Release-please:

1. Reads all commits since the last release
2. Creates (or updates) a release PR for `sanity-plugin-blank-space`

The release PR:

- Bumps the version in `package.json`
- Updates `CHANGELOG.md` with all included commits
- Updates `.release-please-manifest.json`

If multiple commits land before you merge, the PR accumulates all of them.

### 3. Merging Triggers Publishing

When you merge a release PR:

1. GitHub creates a release tag (e.g. `sanity-plugin-blank-space-v1.1.0`)
2. The Release workflow detects the new tag
3. The publish job runs: build + `pnpm publish` to npm

## Configuration Files

| File                            | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `release-please-config.json`    | Package release settings (release type, changelog)       |
| `.release-please-manifest.json` | Tracks current version of the package                    |
| `.github/workflows/release.yml` | GitHub Actions workflow for release-please + npm publish |

## Required Secrets

The publish job requires an `NPM_TOKEN` repository secret in GitHub:

- Must be a **classic Automation** token (not granular) for unscoped packages
- Configured at Settings > Secrets and variables > Actions > Repository secrets

## Manual Steps

The only manual step is **merging the release PR**. Everything else is automated:

```
commit to main
  -> release-please creates/updates PR
    -> you merge the PR
      -> GitHub Release + tag created
        -> npm publish runs automatically
```

## Troubleshooting

**Release PR not created?**

- Check the commit uses conventional format (`feat:`, `fix:`, etc.)
- `chore:`, `docs:`, `refactor:` commits don't trigger releases
- Verify the commit changes files inside the `packages/` directory

**Publish failed?**

- Check the `NPM_TOKEN` secret is set and valid
- Ensure the token is a classic Automation token (granular tokens have scope issues with unscoped packages)
- Check the GitHub Actions log for the specific error
