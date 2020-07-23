import axios, { AxiosResponse } from 'axios'

class GHAPI {
  constructor(private token: string) {}

  // curl -X POST \
  // -H "Authorization: bearer <ACCESS_TOKEN>" \
  // -H "Accept: application/vnd.github.packages-preview+json" \
  // -d '{"query": "{user(login: \"<USERNAME>\") { registryPackagesForQuery(packageType: DOCKER, first: 100) { edges { node { name id versions(first: 100) { nodes {id} } } } } } }"}' \
  // https://api.github.com/graphql
  async getDockerImages(login: string): Promise<AxiosResponse> {
    return axios.post(
      'https://api.github.com/graphql',
      `{
          "query": "{
            user(login: \\"${login}\\") {
              registryPackagesForQuery(packageType: DOCKER, first: 100) {
                edges {
                  node {
                    name
                    id
                    versions(first: 100) {
                      nodes {id}
                    }
                  }
                }
              }
            }
          }"
        }`,
      {
        headers: {
          Accept: 'application/vnd.github.packages-preview+json',
          Authorization: `bearer ${this.token}`
        }
      }
    )
  }
}
export default GHAPI
