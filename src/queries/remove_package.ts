export interface DeletePackageResponse {
  deletePackageVersion: {
    success: boolean
  }
}

export default `
  mutation DeletePackageVersion($id: String!) {
    deletePackageVersion(
      input: {
        packageVersionId: $id,
        clientMutationId: "remove-stale-images-action"
      }
    ) {
      success
    }
  }
`
