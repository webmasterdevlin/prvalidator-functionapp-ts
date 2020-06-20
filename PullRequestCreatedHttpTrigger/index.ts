import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

/*
 * function
 * /api/PullRequestCreatedHttpTrigger
 * */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const data = req.body as PullRequestCreated;
  context.log(
    `https://dev.azure.com/${ACCOUNT_NAME}/${data.resource.repository.project.id}/_apis/git/repositories/${data.resource.repository.id}/pullrequests/${data.resource.pullRequestId}/statuses?api-version=5.0-preview.1`
  );
  context.log("Data Received: " + JSON.stringify(req.body));

  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    CONNECTION_STRING
  );

  const containerClient: ContainerClient = await blobServiceClient.getContainerClient(
    CONTAINER_NAME
  );

  // Create a unique name for the blob
  const blobName = "pull-request-created.json";

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log("\nUploading to Azure storage as blob:\n\t", blobName);

  // Upload data to the blob
  const uploadBlobResponse = await blockBlobClient.upload(
    JSON.stringify(data),
    JSON.stringify(data).length
  );

  console.log(
    "Blob was uploaded successfully. requestId: ",
    uploadBlobResponse.requestId
  );
};

export default httpTrigger;
