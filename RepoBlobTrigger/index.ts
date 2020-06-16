import { AzureFunction, Context } from "@azure/functions";
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
} from "@azure/storage-blob";
import { AbortController } from "@azure/abort-controller";
import { Description, State, StatusPolicy } from "../models/StatusPolicy";

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;

const ONE_MINUTE = 60 * 1000;
const blobName = "Contributors.md";

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    CONNECTION_STRING
  );

  const containerClient: ContainerClient = await blobServiceClient.getContainerClient(
    CONTAINER_NAME
  );

  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(
    blobName
  );

  const exists = await blockBlobClient.exists();
  if (!exists) {
    context.log("Blob does not exists");
    return;
  }

  const downloadTobuffer: Buffer = await blockBlobClient.downloadToBuffer();
  const text = downloadTobuffer.toString();

  if (!text) {
    context.log("EMPTY!!");

    const statusPolicy = new StatusPolicy(
      State.succeeded,
      Description.succeeded
    );
    /*
    const status = (
      await updateStatusPolicy(
        statusPolicy,
        accountName,
        prData.resource.repository.project.name,
        prData.resource.repository.name,
        prData.resource.pullRequestId,
        context
      )
    ).data;*/

    context.log("STATUS::", status);
  } else {
    context.log("NOT EMPTY!!");
  }
};

export default blobTrigger;
