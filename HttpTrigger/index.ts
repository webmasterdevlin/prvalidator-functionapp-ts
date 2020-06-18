import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";
import { BuildCompleted } from "../models/webhooks/BuildCompleted";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

/*
 * function
 * /api/HttpTrigger
 * */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("JavaScript HTTP trigger function processed a request.");

  var messageId;
  if (req.body) {
    messageId = await uploadFiles(req.body);
  }
  if (messageId != null) {
    context.res = {
      body: messageId,
    };
  } else {
    context.res = {
      status: 400,
      body: "Unable to post message to queue",
    };
  }
};
export default httpTrigger;

const defaultAzureCredential = new StorageSharedKeyCredential(
  ACCOUNT,
  ACCESS_KEY
);

const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT}.blob.core.windows.net`,
  defaultAzureCredential
);

const uploadFiles = async (body) => {
  try {
    appendMetaData(body);
    const containerClient = blobServiceClient.getContainerClient(
      CONTAINER_NAME
    );
    const buildId = body.resource.id;
    const blobName = `${buildId}/${body.id}.json`;
    const content = JSON.stringify(body);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(
      content,
      content.length
    );
    console.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    );
    return uploadBlobResponse.requestId;
  } catch (error) {
    console.log(error);
  }
};

function appendMetaData(body) {}
