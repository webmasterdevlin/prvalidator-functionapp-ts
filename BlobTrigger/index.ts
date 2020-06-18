import { AzureFunction, Context } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import axios from "axios";
const FileType = require("file-type");

const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

const blobTrigger: AzureFunction = async function (
  context: Context,
  buffer: any
): Promise<void> {
  const data = JSON.parse(buffer.toString("utf8"));

  const buildId = extractBuildId(data);
  const projectId = extractProjectId(data);

  try {
    await fetchUrl(
      artifacts_uri(ACCOUNT_NAME, projectId, buildId),
      buildId,
      context
    );
    context.res = { status: 201, body: "Insert succeeded." };
    context.done(null, context.res);
  } catch (error) {
    context.res = { status: 500, body: "Exception" };
    context.done(null, context.res);
  }
};

const account = process.env.ACCOUNT;
const accountKey = process.env.ACCESS_KEY;
const defaultAzureCredential = new StorageSharedKeyCredential(
  account,
  accountKey
);
const username = process.env.DEVOPS_USERNAME;
const pat = process.env.PAT_KEY;

const extractBuildId = (blob) => blob.resource.id;
const extractProjectId = (blob) => blob.resourceContainers.project.id;
const auth = () =>
  `Basic ${Buffer.from(username + ":" + pat).toString("base64")}`;
const artifacts_uri = (accountName, projectId, buildId) =>
  `https://dev.azure.com/${accountName}/${projectId}/_apis/build/Builds/${buildId}/artifacts?api-version=5.1`;

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);

const headers = {
  Authorization: auth(),
  "Content-Type": "application/json",
  "User-Agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
};

// async function fetchUrl(url, buildId, context) {
//   context.log("fetchUrl");

//   const response = await fetch(url, { headers: headers });
//   if (!response.ok)
//     throw new Error(`unexpected response ${response.statusText}`);
//   const content = await response.json();
//   context.log("CONTENT::", content);
//   await downloadArtifacts(content, buildId, context);
// }

const fetchUrl = async (url: string, buildId: string, context) => {
  context.log("fetchUrl");
  try {
    const { data } = await axios.get(url, { headers });
    context.log("DATA::", data);
    await downloadArtifacts(data, buildId, context);
  } catch (e) {
    throw new Error(e.message);
  }
};

// async function downloadArtifacts(json, buildId, context) {
//   context.log("downloadArtifacts");

//   for (let i = 0; i < json.value.length; i++) {
//     const element = json.value[i];
//     const url = element.resource.downloadUrl;
//     if (url) {
//       context.log("URL::", url);
//       const fileName = `${element.name}.zip`;
//       const artifact = await download(url);
//       await uploadFiles(artifact, fileName, buildId, context);
//     }
//   }
// }

async function downloadArtifacts(resources, buildId, context) {
  context.log("downloadArtifacts");

  for (let i = 0; i < resources.count; i++) {
    const resource = resources.value[i];
    const url = resource.drop.downloadUrl;

    if (url) {
      context.log("URL::", url);
      const fileName = `${resource}.zip`;
      const artifact = await download(url, context);
      await uploadFiles(artifact, fileName, buildId, context);
    }
  }
}

async function download(url, context) {
  context.log("download");
  const response = await fetch(url, { headers: headers });
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  // @ts-ignore
  return await response.buffer();
}

// const download = async (url: string, context) => {
//   context.log("download");
//   try {
//     const { data } = await axios.get(url, { headers });
//     return Buffer.from(data);
//   } catch (e) {
//     throw new Error(e.message);
//   }
// };

const uploadFiles = async (content, blobName, buildId, context) => {
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

export default blobTrigger;
