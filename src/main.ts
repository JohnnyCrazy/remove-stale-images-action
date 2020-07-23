import * as core from '@actions/core'
import { context } from '@actions/github'
import GHAPI from './api'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const api = new GHAPI(token)

    const response = await api.getDockerImages(context.repo.owner)

    core.setOutput('response', response)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
