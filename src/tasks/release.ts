import fs from 'fs'
import util from 'util'
import path from 'path'
import { context, getOctokit } from '@actions/github'

const readFile = util.promisify(fs.readFile)

export type ReleaseOptions = {
  /** Token string for GitHub. */
  token: string

  /** Target version tag. We will use the name tagged in the current action if empty. */
  version?: string

  /** Convert Markdown link to GitHub profile into the mention link of GitHub. */
  convertGitHubMention?: boolean
}

/**
 * Update GitHub release for specified version based on parsed contents from CHANGELOG.md.
 */
export default async function release({
  token,
  version: _version,
  convertGitHubMention = true,
}: ReleaseOptions) {
  const octokit = getOctokit(token)
  const version =
    _version ||
    (() => {
      if (context.ref.startsWith('refs/tags/')) return context.ref.slice(10)
      throw new Error('Release task failed to detect the target version.')
    })()

  // Parse CHANGELOG.md
  const changelog = path.resolve(process.cwd(), 'CHANGELOG.md')
  const content = await readFile(changelog, 'utf8')
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
    prerelease: version.startsWith('v0.0.'),
    repo: context.repo.repo,
    tag_name: version,
  })
}
