import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

export const uploadZipToStorage = async (
  buildResourcedId: number,
  drop: Buffer,
  blobName: string
) => {
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    CONNECTION_STRING
  );
  const containerClient: ContainerClient = await blobServiceClient.getContainerClient(
    CONTAINER_NAME
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName + ".zip");
  await blockBlobClient.upload(drop, drop.length);
};
