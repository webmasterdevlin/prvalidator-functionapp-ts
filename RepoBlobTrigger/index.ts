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
const blobName = "Contributors.md";

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  context.log(
    "Blob trigger function processed blob \n Name:",
    context.bindingData.name,
    "\n Blob Size:",
    myBlob.length,
    "Bytes"
  );

  const abortCtrl = AbortController.timeout(5 * ONE_MINUTE);

  context.log("blobServiceClient");
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    CONNECTION_STRING
  );

  context.log("containerClient");
  const containerClient: ContainerClient = await blobServiceClient.getContainerClient(
    CONTAINER_NAME
  );

  context.log("blockBlobClient");
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(
    blobName
  );

  const exists = await blockBlobClient.exists();
  if (!exists) {
    context.log("Blob does not exists");
    return;
  }

  context.log("downloadBlockBlobResponse");

  context.log("CHECK::readable");
  const readable = await blockBlobClient.download();
  fs.readFile(readable, { encoding: "utf8" }, function (err, data) {
    if (err) {
      context.log(err);
    } else {
      context.log(data);
    }
  });

  context.log("CHECK::downloadtobuffer");
  const downloadTobuffer: Buffer = await blockBlobClient.downloadToBuffer();
  fs.readFile(downloadTobuffer, { encoding: "utf8" }, function (err, data) {
    if (err) {
      context.log(err);
    } else {
      context.log(data);
    }
  });
};

export default blobTrigger;
