import * as core from '@actions/core'
import release from './tasks/release'
import upload from './tasks/upload'

const get = (name: string, required = true) => core.getInput(name, { required })

async function run() {
  try {
    switch (get('task')) {
      case 'release':
        await release({ token: get('token') })
        break
      case 'upload':
        await upload({ token: get('token'), files: get('files').split(',') })
    }
  } catch (e: unknown) {
    core.setFailed(e instanceof Error ? e : 'Unknown error')
  }
}

run()
