import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BuildCompleted } from "../models/webhooks/BuildCompleted";
import { Description, State, StatusPolicy } from "../models/StatusPolicy";
import { Vote } from "../models/ApprovePullRequest";
import {
  GitPullRequestResources,
  GitRepositories,
  PullRequestCreated,
} from "../models/webhooks/PullRequestCreated";
import {
  StorageSharedKeyCredential,
  BlobServiceClient,
  ContainerClient,
  BlobClient,
  BlockBlobClient,
  BlobDownloadResponseModel,
} from "@azure/storage-blob";

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;

const accountName = process.env.ACCOUNT_NAME;

const ONE_MINUTE = 60 * 1000;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const data = req.body as PullRequestCreated;
  context.log("Data Received: " + JSON.stringify(req.body));

  context.log(
    `https://dev.azure.com/${accountName}/${data.resource.repository.project.name}/_apis/git/repositories/${data.resource.repository.name}/pullrequests/${data.resource.pullRequestId}/statuses?api-version=5.0-preview.1`
  );

  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    CONNECTION_STRING
  );

  const containerClient: ContainerClient = await blobServiceClient.getContainerClient(
    CONTAINER_NAME
  );

  // Create a unique name for the blob
  const blobName = "pull-request-created.txt";

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log("\nUploading to Azure storage as blob:\n\t", blobName);

  // Upload data to the blob
  const info = "Hello, World!";
  const uploadBlobResponse = await blockBlobClient.upload(info, info.length);
  console.log(
    "Blob was uploaded successfully. requestId: ",
    uploadBlobResponse.requestId
  );
};

export default httpTrigger;
