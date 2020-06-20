import { AzureFunction, Context } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts } from "../models/Artifacts";
import { getArtifactBuffer, getArtifacts } from "../api-calls";
import { PullRequestCreated } from "../models/webhooks/PullRequestCreated";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;

let newContext: Context;

/*
 * function
 * /api/BlobTrigger
 * */
const blobTrigger: AzureFunction = async function (
  context: Context,
  buffer: any
): Promise<void> {
  newContext = context;
  try {
    const data: PullRequestCreated = JSON.parse(buffer.toString("utf8"));
    // this does not exists
    // const buildId =  data.resource.id;
    const buildId = "719"; // sample build id
    const projectId = data.resourceContainers.project.id;

    /*
     * FIX: buildId is undefined
     * buildId comes from BuildCompleted webhook, not in the PullRequestCreated object from parsed file
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

export default blobTrigger;

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
