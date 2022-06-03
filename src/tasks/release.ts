import fs from 'fs/promises'
import path from 'path'
import { context, getOctokit } from '@actions/github'

export type ReleaseOptions = {
  /** Token string for GitHub. */
  token: string

  /** Target version tag. We will use the name tagged in the current action if empty. */
  version?: string

  /** Mark the release as pre-release. If not defined, detect the right value automatically from the version, by following Marp project guideline. */
  preRelease?: boolean

  /** Convert Markdown link to GitHub profile into the mention link of GitHub. */
  convertGitHubMention?: boolean
}

/**
 * Update GitHub release for specified version based on parsed contents from CHANGELOG.md.
 */
export default async function release({
  token,
  version: _version,
  preRelease = undefined,
  convertGitHubMention = true,
}: ReleaseOptions) {
  const octokit = getOctokit(token)
  const version =
    _version ||
    (() => {
      if (context.ref.startsWith('refs/tags/')) return context.ref.slice(10)
      throw new Error('Release task failed to detect the target version.')
    })()
  const isPreRelease =
    preRelease !== undefined ? preRelease : version.startsWith('v0.0.')

  // Parse CHANGELOG.md
  const changelog = path.resolve(process.cwd(), 'CHANGELOG.md')
  const content = await fs.readFile(changelog, 'utf8')
  const current = { parsing: false, body: '' }

  for (const line of content.split('\n')) {
    if (current.parsing) {
      if (line.startsWith('## ') || line === '---' || line === '</details>') {
        current.parsing = false
      } else {
        current.body += `${line}\n`
      }
    } else if (line.startsWith(`## ${version} - `)) {
      current.parsing = true
    }
  }

  let body = current.body.trim()

  if (!body) {
    throw new Error(`Not found the content of release note for ${version}.`)
  }

  if (convertGitHubMention) {
    body = body.replace(
      /\[@([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\]\(https?:\/\/github\.com\/\1\/?\)/gi,
      '@$1'
    )
  }

  // Create GitHub release
  await octokit.rest.repos.createRelease({
    body,
    name: version,
    owner: context.repo.owner,
    prerelease: isPreRelease,
    repo: context.repo.repo,
    tag_name: version,
  })
}
