export interface PackagesResponse {
  user: {
    packages: {
      edges: {
        node: {
          id: string
          name: string
          versions: {
            totalCount: number
            nodes: {
              id: string
              version: string
            }[]
          }
        }
      }[]
    }
  }
}

export default `
  query Packages($login: String!, $names: [String!]) {
    user(login: $login) {
      packages(packageType: DOCKER, first: 100, names: $names) {
        edges {
          node {
            id
            name
            versions(
              orderBy: { field: CREATED_AT, direction: DESC }
              first: 100
            ) {
              nodes {
                id
                version
              }
            }
          }
        }
      }
    }
  }
`
