import { AzureFunction, Context } from "@azure/functions";
import axios from "axios";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { headers } from "../utils";
import { Context } from "../models/StatusPolicy";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const ACCESS_KEY = process.env.ACCESS_KEY;

/*
 * function
 * /api/BlobTrigger
 * */
const blobTrigger: AzureFunction = async function (
  { done, log }: Context,
  buffer: any
): Promise<void> {
  const data = JSON.parse(buffer.toString("utf8"));
  const buildId = extractBuildId(data);
  const projectId = extractProjectId(data);

  const url = artifacts_uri(projectId, buildId);

  try {
    await fetchUrl(url, buildId, log);
    done(null, { status: 201, body: "Insert succeeded." });
  } catch (error) {
    log.error(error);
    done(null, { status: 500, body: "Exception" });
  }
};

export default blobTrigger;

const defaultAzureCredential = new StorageSharedKeyCredential(
  ACCOUNT,
  ACCESS_KEY
);

const extractBuildId = (blob) => blob.resource.id;
const extractProjectId = (blob) => blob.resourceContainers.project.id;

const artifacts_uri = (projectId: string, buildId: string) =>
  `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/Builds/${buildId}/artifacts?api-version=5.1`;

const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT}.blob.core.windows.net`,
  defaultAzureCredential
);

const download = async (url: string) => {
  try {
    const { data } = await axios.get(url, { headers });
    return Buffer.from(data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const uploadFiles = async (
  content: Buffer,
  blobName: string,
  buildId: string
) => {
  const containerName = `builds/${buildId}/artifacts`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    content,
    content.length
  );
  return uploadBlobResponse.requestId;
};

const fetchUrl = async (url: string, buildId: string, log) => {
  try {
    const { data } = await axios.get(url, { headers });
    return await downloadArtifacts(data, buildId, log);
  } catch (e) {
    throw new Error(e.message);
  }
};

const downloadArtifacts = async (json: any, buildId: string, log) => {
  for (let i = 0; i < json.value.length; i++) {
    const element = json.value[i];
    const url = element.resource.downloadUrl;
    if (url) {
      log(url);
      const fileName = `${element.name}.zip`;
      const artifact = await download(url);
      await uploadFiles(artifact, fileName, buildId);
    }
  }
};
