import * as core from '@actions/core'
import release from './tasks/release'

async function run() {
  try {
    switch (core.getInput('task', { required: true })) {
      case 'release':
        await release({ token: core.getInput('token', { required: true }) })
        break
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
