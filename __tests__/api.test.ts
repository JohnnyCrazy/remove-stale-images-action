import GHAPI from '../src/api'

describe('GHAPI', () => {
  it('does its job', async () => {
    const token = process.env.GH_TOKEN
    if (!token) throw new Error('No GH_TOKEN provided')

    const api = new GHAPI(token)
    try {
      const data = await api.getDockerImages('JohnnyCrazy', ['odin'])
      // eslint-disable-next-line no-console
      console.log(data.user.packages.edges[0].node.versions.nodes[0].version)
    } catch (error) {
      console.log(error)
    }
  })
})
