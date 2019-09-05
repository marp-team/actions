import fs from 'fs'
import path from 'path'

const unreleased = '## [Unreleased]'
const [date] = new Date().toISOString().split('T')
const version = `## v${process.env.npm_package_version} - ${date}`

const changelog = path.resolve(process.cwd(), 'CHANGELOG.md')
const content = fs.readFileSync(changelog, 'utf8')

fs.writeFileSync(
  changelog,
  content.replace(unreleased, `${unreleased}\n\n${version}`)
)
