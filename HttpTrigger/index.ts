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
  let messageId;
  if (req.body) messageId = await uploadFiles(req.body, context);

  if (messageId != null) context.res = { body: messageId };
  else context.res = { status: 400, body: "Unable to post message to queue" };
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

const uploadFiles = async (body: PullRequestCreated, context: Context) => {
  try {
    // There's a bug here caught using TypeScript compilation
    // appendMetaData(body)
    // object structure from PullRequestCreated webhook is different from BuildCompleted webhook
    const containerClient = blobServiceClient.getContainerClient(
      CONTAINER_NAME
    );
    const repositoryId = body.resource.repository.id;

    const blobName = `${repositoryId}/${body.id}.json`;
    const content = JSON.stringify(body);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(
      content,
      content.length
    );
    context.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    );

    return uploadBlobResponse.requestId;
  } catch (error) {
    context.log(error);
  }
};

/*
 * This is a bug caught using TypeScript compilation
 * I tested it in runtime. The timeDiff was NaN.
 * */
const appendMetaData = (body: BuildCompleted) => {
  const start = new Date(body.resource.startTime); // "2020-06-13T18:13:55.7788727Z"
  const finish = new Date(body.resource.finishTime); // "2020-06-13T18:15:05.9171757Z"
  // const timeDiff = finish - start;

  //  body.customData = {
  //    executionTimeMs: timeDiff,
  //  };
};
