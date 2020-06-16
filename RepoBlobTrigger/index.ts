import { AzureFunction, Context } from "@azure/functions";
import {
  StorageSharedKeyCredential,
  BlobServiceClient,
  ContainerClient,
  BlobClient,
  BlockBlobClient,
  BlobDownloadResponseModel,
} from "@azure/storage-blob";
import { AbortController } from "@azure/abort-controller";
import { Description, State, StatusPolicy } from "../models/StatusPolicy";
import { updateStatusPolicy } from "../api-calls";

const fs = require("fs");
const path = require("path");

const STORAGE_ACCOUNT_NAME = process.env.ACCOUNT;
const ACCOUNT_ACCESS_KEY = process.env.ACCESS_KEY;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;

const accountName = process.env.ACCOUNT_NAME;

const ONE_MINUTE = 60 * 1000;
const blobName = "Contributors.md";

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  const abortCtrl = AbortController.timeout(5 * ONE_MINUTE);

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
    /*    context.log(
      `https://dev.azure.com/${accountName}/${prData.resource.repository.project.name}/_apis/git/repositories/${prData.resource.repository.name}/pullrequests/${prData.resource.pullRequestId}/statuses?api-version=5.0-preview.1`
    );

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
