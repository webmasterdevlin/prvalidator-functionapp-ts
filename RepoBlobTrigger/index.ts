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

const fs = require("fs");
const path = require("path");

const STORAGE_ACCOUNT_NAME = process.env.ACCOUNT;
const ACCOUNT_ACCESS_KEY = process.env.ACCESS_KEY;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.REPO_CONTAINER_NAME;

const ONE_MINUTE = 60 * 1000;

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  const abortCtrl = AbortController.timeout(5 * ONE_MINUTE);

  const blobName = "Contributors.md";
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
    console.log("Blob does not exists");
    return;
  }

  const downloadBlockBlobResponse: BlobDownloadResponseModel = await blockBlobClient.download(
    0
  );

  // TODO: Check if readabeStreamBody is needed or downloadBlockBlobResponse
  const readable = downloadBlockBlobResponse.readableStreamBody;

  try {
    const data = await fs.readFile(readable);
    context.log(data);
    if (!data) {
      context.log("File is empty");
    } else {
      context.log("File not empty");
    }
  } catch (error) {
    context.log(error);
  }

  context.log(
    "Blob trigger function processed blob \n Name:",
    context.bindingData.name,
    "\n Blob Size:",
    myBlob.length,
    "Bytes"
  );
};

export default blobTrigger;
