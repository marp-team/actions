import assert from 'assert'
import fs from 'fs'
import util from 'util'
import path from 'path'
import { debug } from '@actions/core'
import { context, GitHub } from '@actions/github'
import mime from 'mime-types'
import { ReleaseOptions } from './release'

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)

const resolveFiles = async (files: string[]) => {
  const ret: string[] = []

  for (const f of files.map((f) => path.resolve(process.cwd(), f))) {
    try {
      const fstat = await stat(f)

      if (fstat.isFile()) {
        ret.push(f)
      } else if (fstat.isDirectory()) {
        ret.push(
          ...(await readdir(f, { withFileTypes: true }))
            .filter((d) => !d.isDirectory())
            .map((d) => path.resolve(f, d.name))
        )
      }
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  }

  return ret
}

export type UploadOptions = ReleaseOptions & {
  /** Files or directories for upload. */
  files: string[]
}

/**
 * Upload files to GitHub release for specified version.
 */
export default async function upload(opts: UploadOptions) {
  const octokit = new GitHub(opts.token)
  const version =
    opts.version ||
    (() => {
      if (context.ref.startsWith('refs/tags/')) return context.ref.slice(10)
      throw new Error('Release task failed to detect the target version.')
    })()

  const files = await resolveFiles(opts.files)
  assert(files.length, 'Files for uploading are not found.')

  // Get existed release
  const { data } = await octokit.repos.getReleaseByTag({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag: version,
  })

  // Upload files
  for (const f of files) {
    debug(`Uploading ${f}...`)

    const { size } = await stat(f)

    await octokit.repos.uploadReleaseAsset({
      file: fs.createReadStream(f),
      headers: {
        'content-type': mime.lookup(f) || 'application/octet-stream',
        'content-length': size,
      },
      name: path.basename(f),
      url: data.upload_url,
    })
  }
}
