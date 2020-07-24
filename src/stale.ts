import { IGHAPI } from './ghapi'

// Makes sure that only "keep"-amount of versions exist for each package "names" in the account of the "owner"
export default async function stale(
  owner: string,
  packageNames: string[],
  keep: number,
  api: IGHAPI,
  info: (msg: string) => void = () => {}
): Promise<void> {
  const {
    user: {
      packages: { edges: packages }
    }
  } = await api.getDockerImages(owner, packageNames)

  for (const dockerPackage of packages) {
    info(`🔎 Processing package ${dockerPackage.node.name} (${dockerPackage.node.id}).`)

    const { versions } = dockerPackage.node
    // Why - 1? There is a "hidden" version called "docker-base-layer". Should not be removed probably :)
    const totalCount = versions.totalCount - 1

    if (totalCount <= keep) info(`--> ✅ Found ${totalCount} versions. Nothing will be done.`)
    else {
      const toRemove = totalCount - keep
      info(`--> ℹ Found ${totalCount} versions. ${toRemove} versions will be removed.`)

      for (let i = 1; i <= toRemove; i++) {
        const version = versions.nodes[i]
        const {
          deletePackageVersion: { success }
        } = await api.deletePackage(version.id)
        info(`--> ℹ Removed ${version.version} (${version.id}): ${success}`)
      }
      info(`--> ✅ Finished package ${dockerPackage.node.name}`)
    }
  }
}
