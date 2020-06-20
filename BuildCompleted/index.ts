import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts } from "../models/Artifacts";
import {
  getArtifactBuffer,
  getArtifacts,
  getBuilds,
  getPullRequests,
} from "../api-calls";
import { BuildCompleted } from "../models/webhooks/BuildCompleted";
import { Build } from "../models/Builds";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;

let newContext: Context;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  newContext = context;
  try {
    // const data: PullRequestCreated = req.body;
    // const buildCompletedId = "275"; // data.resource.id; // this does not exists

    const buildCompleted = req.body as BuildCompleted;
    const buildCompletedId = buildCompleted.id;
    const projectId = buildCompleted.resourceContainers.project.id;

    const builds = await getBuilds(projectId);

    const build = builds.value.find(
      (build) => build.id.toString() === buildCompletedId
    );
    const repositoryId = build.repository.id;

    const pullRequests = await getPullRequests(projectId, repositoryId);
    // const pullRequest = pullRequests.value(pr => pr.createdDate === )
    /*
     * FIX: buildCompletedId is undefined
     * buildCompletedId comes from BuildCompleted webhook
     * TODO: find a way to get the buildCompletedId
     * */
    context.log("buildCompletedId::", buildCompletedId);

    try {
      await fetchArtifacts(projectId, buildCompletedId);
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
