import { AzureFunction, Context } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts } from "../models/Artifacts";
import { ParsedBlobBuffer } from "../models/ParsedBlobBuffer";
import { getArtifacts, getArtifact } from "../api-calls";

const { Readable } = require("stream");

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

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
    const data: ParsedBlobBuffer = JSON.parse(buffer.toString("utf8"));
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
        const fileName = artifact.name + ".zip"; // NEED FIX: corrupted file
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
    const artifact = await getArtifact(artifactUrl);
    return Buffer.from(artifact);
  } catch (e) {
    newContext.log(e.message);
  }
};

const uploadFiles = async (
  buildId: string,
  drops: Buffer,
  blobName: string
): Promise<void> => {
  newContext.log("uploadFiles");
  const containerName = `builds/${buildId}/artifacts`;
  newContext.log("containerName", containerName);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const stream = Readable.from(drops.toString());
  const response = await blockBlobClient.upload(stream, 10);
  newContext.log(response);
};
