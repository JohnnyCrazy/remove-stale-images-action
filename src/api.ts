import { GraphQLClient } from 'graphql-request'

import packagesQuery, { PackagesResponse } from './queries/packages'
import deletePackageMutation, { DeletePackageResponse } from './queries/remove_package'

class GHAPI {
  private readonly client: GraphQLClient

  constructor(token: string) {
    this.client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Accept: 'application/vnd.github.packages-preview+json',
        Authorization: `Bearer ${token}`
      }
    })
  }

  async getDockerImages(login: string, names: string[]): Promise<PackagesResponse> {
    return this.client.request<PackagesResponse>(packagesQuery, {
      login,
      names
    })
  }

  async deletePackage(id: string): Promise<DeletePackageResponse> {
    return this.client.request<DeletePackageResponse>(deletePackageMutation, {
      id
    })
  }
}
export default GHAPI
