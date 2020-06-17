import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

/* Application settings */
const account = process.env.ACCOUNT;
const accountKey = process.env.ACCESS_KEY;
const containerName = process.env.CONTAINER_NAME;

/*
 * function
 * /api/HttpTrigger
 * */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("TypeScript HTTP trigger function processed a request.");

  let messageId;
  if (req.body) messageId = await uploadFiles(req.body);

  if (messageId != null) context.res = { body: messageId };
  else context.res = { status: 400, body: "Unable to post message to queue" };
};

const defaultAzureCredential = new StorageSharedKeyCredential(
  account,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);

const uploadFiles = async (body) => {
  try {
    appendMetaData(body);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const buildId = body.resource.repository.id;

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

function appendMetaData(body) {
  const start: any = new Date(body.resource.startTime);
  const finish: any = new Date(body.resource.finishTime);
  const timeDiff = finish - start;

  body.customData = {
    executionTimeMs: timeDiff,
  };
}

export default httpTrigger;
