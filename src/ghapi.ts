import { GraphQLClient } from 'graphql-request'

import packagesQuery, { PackagesResponse } from './queries/packages'
import deletePackageMutation, { DeletePackageResponse } from './queries/remove_package'

export interface IGHAPI {
  getDockerImages(login: string, names: string[]): Promise<PackagesResponse>
  deletePackage(id: string): Promise<DeletePackageResponse>
}

export default class GHAPI implements IGHAPI {
  private readonly client: GraphQLClient

  constructor(token: string) {
    this.client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Accept: 'application/vnd.github.package-deletes-preview+json',
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
