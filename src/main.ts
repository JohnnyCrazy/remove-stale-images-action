import * as core from '@actions/core'
import { context } from '@actions/github'
import GHAPI from './api'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const names = core.getInput('names').split(',')
    const keep = parseInt(core.getInput('keep'))

    const api = new GHAPI(token)
    const response = await api.getDockerImages(context.repo.owner, names)

    core.info(`ℹ I will keep ${keep} versions of each package.`)
    for (const dockerPackage of response.user.packages.edges) {
      core.info(`🔎 Processing package ${dockerPackage.node.name} (${dockerPackage.node.id}).`)

      const { versions } = dockerPackage.node
      if (versions.totalCount <= keep) core.info(`-> ✅ Found ${versions.totalCount} versions. Nothing will be done.`)
      else {
        const toRemove = versions.totalCount - keep
        core.info(`-> ℹ Found ${versions.totalCount} versions. ${toRemove} versions will be removed.`)

        for (let i = 0; i < toRemove; i++) {
          const version = versions.nodes[i]
          const {
            deletePackageVersion: { success }
          } = await api.deletePackage(version.id)
          core.info(`-> ℹ Removed ${version.version} (${version.id}): ${success}`)
        }
        core.info('✅ Done')
      }
    }
  } catch (error) {
    core.debug(error)

    core.setFailed(error.message)
  }
}

run()
