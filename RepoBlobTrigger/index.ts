import { AzureFunction, Context } from "@azure/functions";
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
} from "@azure/storage-blob";

import { Description, State, StatusPolicy } from "../models/StatusPolicy";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";
import { updateStatusPolicy } from "../api-calls";

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

const blobName = "Contributors.md";
const prBlobName = "pull-request-created.json";

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

  const prBlockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(
    prBlobName
  );

  const exists = await blockBlobClient.exists();
  if (!exists) {
    context.log("Blob does not exists");
    return;
  }

  const downloadTobuffer: Buffer = await blockBlobClient.downloadToBuffer();
  const md = downloadTobuffer.toString();

  const prExists = await prBlockBlobClient.exists();
  if (!prExists) {
    context.log("Blob does not exists");
    return;
  }

  const prDownloadTobuffer: Buffer = await prBlockBlobClient.downloadToBuffer();
  const pr = prDownloadTobuffer.toString();

  context.log("PR::", pr);

  const data = JSON.parse(pr) as PullRequestCreated;

  context.log("###################################################");

  context.log("DATA::", data);

  if (!md) {
    context.log("MD is EMPTY!!");

    const statusPolicy = new StatusPolicy(State.failed, Description.failed);
    const status = (
      await updateStatusPolicy(
        statusPolicy,
        ACCOUNT_NAME,
        data.resource.repository.project.name,
        data.resource.repository.name,
        data.resource.pullRequestId,
        context
      )
    ).data;
    context.log("STATUS_FAILED::", status);
  } else {
    context.log("MD is Not EMPTY!!");

    const statusPolicy = new StatusPolicy(
      State.succeeded,
      Description.succeeded
    );
    const status = (
      await updateStatusPolicy(
        statusPolicy,
        ACCOUNT_NAME,
        data.resource.repository.project.name,
        data.resource.repository.name,
        data.resource.pullRequestId,
        context
      )
    ).data;
    context.log("STATUS_SUCCEEDED::", status);
  }
};

export default blobTrigger;
