import { AzureFunction, Context } from "@azure/functions";
import axios from "axios";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { headers } from "../utils";
import { BuildCompletedResources } from "../models/webhooks/BuildCompleted";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const ACCESS_KEY = process.env.ACCESS_KEY;

/*
 * function
 * /api/BlobTrigger
 * */
const blobTrigger: AzureFunction = async function (
  context: Context,
  buffer: any
): Promise<void> {
  const data = JSON.parse(buffer.toString("utf8"));

  const buildId = extractBuildId(data);
  context.log("buildId::", buildId);

  const projectId = extractProjectId(data);
  context.log("projectId::", projectId);

  const url = artifacts_uri(ACCOUNT_NAME, projectId, buildId);
  context.log("URL::", url);

  try {
    await fetchUrl(url, buildId, context);
    let res = { status: 201, body: "Insert succeeded." };
    context.done(null, res);
  } catch (error) {
    let res = { status: 500, body: "Exception" };
    context.done(null, res);
  }
};

export default blobTrigger;

const defaultAzureCredential = new StorageSharedKeyCredential(
  ACCOUNT,
  ACCESS_KEY
);

const extractBuildId = (blob) => blob.resource.id;
const extractProjectId = (blob) => blob.resourceContainers.project.id;

const artifacts_uri = (accountName, projectId: string, buildId: string) =>
  `https://dev.azure.com/${accountName}/${projectId}/_apis/build/Builds/${buildId}/artifacts?api-version=5.1`;

const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT}.blob.core.windows.net`,
  defaultAzureCredential
);

async function fetchUrl(url, buildId, context) {
  const response = await fetch(url, { headers: headers });
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  const content = await response.json();
  return await downloadArtifacts(content, buildId, context);
}

async function downloadArtifacts(json, buildId, context) {
  for (let i = 0; i < json.value.length; i++) {
    const element = json.value[i];
    const url = element.resource.downloadUrl;
    if (url) {
      const fileName = `${element.name}.zip`;
      const artifact = await download(url);
      await uploadFiles(artifact, fileName, buildId, context);
    }
  }
}

async function download(url) {
  const response = await fetch(url, { headers: headers });
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  // @ts-ignore
  return await response.buffer();
}

const uploadFiles = async (
  content: Buffer,
  blobName: string,
  buildId: string,
  context
) => {
  context.log("uploadFiles");
  const containerName = `builds/${buildId}/artifacts`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    content,
    content.length
  );
  return uploadBlobResponse.requestId;
};
