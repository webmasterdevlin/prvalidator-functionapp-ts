import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts } from "../models/Artifacts";
import { ParsedBlobBuffer } from "../models/ParsedBlobBuffer";
import { getArtifactBuffer, getArtifacts } from "../api-calls";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

let newContext: Context;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  newContext = context;
  try {
    const data: PullRequestCreated = req.body;
    const buildId = "275"; // data.resource.id; // this does not exists
    const projectId = data.resourceContainers.project.id;

    /*
     * FIX: buildId is undefined
     * buildId comes from BuildCompleted webhook
     * TODO: find a way to get the buildId
     * */
    context.log("buildId::", buildId);

    try {
      await fetchArtifacts(projectId, buildId);
      context.done(null, { status: 201, body: "Insert succeeded." });
    } catch (error) {
      context.log.error(error);
      context.done(null, { status: 500, body: "Exception" });
    }
  } catch (error) {
    context.log(error);
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

const fetchArtifacts = async (
  projectId: string,
  buildId: string
): Promise<void> => {
  try {
    const artifacts = await getArtifacts(projectId, buildId);
    await downloadArtifacts(artifacts, buildId);
  } catch (e) {
    newContext.log(e.message);
  }
};

const downloadArtifacts = async (
  artifacts: Artifacts,
  buildId: string
): Promise<void> => {
  try {
    artifacts.value.map(async (artifact) => {
      const url = artifact.resource.downloadUrl;
      if (url) {
        const fileName = artifact.name + ".zip";
        const drop = await downloadDrop(url);
        await uploadFiles(buildId, drop, fileName);
      }
    });
  } catch (e) {
    newContext.log(e.message);
  }
};

const downloadDrop = async (artifactUrl: string): Promise<Buffer> => {
  try {
    return await getArtifactBuffer(artifactUrl);
  } catch (e) {
    newContext.log(e.message);
  }
};

const uploadFiles = async (
  buildId: string,
  drop: Buffer,
  blobName: string
): Promise<void> => {
  const containerName = `builds/${buildId}/artifacts`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(drop, drop.length);
};