export interface DeletePackageResponse {
  deletePackageVersion: {
    success: boolean
  }
}

export default `
  mutation Two($id: String!) {
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
