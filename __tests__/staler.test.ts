import { Mock, It, IMock, Times } from 'moq.ts'
import { IGHAPI } from '../src/lib/ghapi'
import staler from '../src/lib/staler'

function generateApiMock(names: string[], amountOfTags: number): IMock<IGHAPI> {
  const apiMock = new Mock<IGHAPI>()

    .setup(api => api.deletePackage(It.IsAny()))
    .callback(() => Promise.resolve({ deletePackageVersion: { success: true } }))

    .setup(api => api.getDockerImages(It.IsAny(), It.IsAny()))
    .callback(() =>
      Promise.resolve({
        user: {
          packages: {
            edges: names.map((name, i) => ({
              node: {
                id: `${i}`,
                name,
                versions: {
                  totalCount: amountOfTags + 1,
                  nodes: [
                    {
                      id: `base-docker-layer`,
                      version: `base-docker-layer`
                    },
                    ...Array.from(Array(amountOfTags), (_, i) => ({
                      id: `${name}-id-${i}`,
                      version: `${name}-tag-${i}`
                    }))
                  ]
                }
              }
            }))
          }
        }
      })
    )

  return apiMock
}

describe('staler', () => {
  it('does not remove images if the amount is less than "keep"', async () => {
    const apiMock = generateApiMock(['test'], 5)

    await staler('JohnnyCrazy', ['test'], 10, apiMock.object())

    apiMock.verify(api => api.deletePackage(It.IsAny()), Times.Never())
  })

  it('does not remove images if the amount is equal to "keep"', async () => {
    const apiMock = generateApiMock(['test'], 10)

    await staler('JohnnyCrazy', ['test'], 10, apiMock.object())

    apiMock.verify(api => api.deletePackage(It.IsAny()), Times.Never())
  })

  it('removes stale images if the amount is larger than "keep"', async () => {
    const apiMock = generateApiMock(['test'], 50)

    await staler('JohnnyCrazy', ['test'], 10, apiMock.object())

    for (let i = 0; i <= 39; i++) apiMock.verify(api => api.deletePackage(`test-id-${i}`), Times.Once())
    // don't discard base-docker-layer
    apiMock.verify(api => api.deletePackage('base-docker-layer'), Times.Never())
  })

  it('removes stale images if the amount is larger than "keep" for multiple packages', async () => {
    const apiMock = generateApiMock(['test', 'test2'], 50)

    await staler('JohnnyCrazy', ['test', 'test2'], 10, apiMock.object())

    for (let i = 0; i <= 39; i++) apiMock.verify(api => api.deletePackage(`test-id-${i}`), Times.Once())
    for (let i = 0; i <= 39; i++) apiMock.verify(api => api.deletePackage(`test2-id-${i}`), Times.Once())
    // don't discard base-docker-layer
    apiMock.verify(api => api.deletePackage('base-docker-layer'), Times.Never())
  })
})
