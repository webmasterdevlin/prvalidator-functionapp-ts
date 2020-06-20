import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts, ArtifactsName } from "../models/Artifacts";
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
let pullRequestId = "";

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
    const pullRequest = pullRequests.value[0];
    const pullRequestId = pullRequest.pullRequestId;

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
    await downloadArtifacts(artifacts);
  } catch (e) {
    newContext.log(e.message);
  }
};

const downloadArtifacts = async (artifacts: Artifacts): Promise<void> => {
  try {
    artifacts.value.map(async (artifact) => {
      const url = artifact.resource.downloadUrl;
      if (url) {
        const artifactToBeScanned = await downloadArtifact(url);
        /*
         * TODO: Scan each artifact here
         * Use a function that will scan the artifact
         * or upload the artifact then BlobTrigger a Function App that will scan this artifact
         * The first approach is much simpler
         * Update PullRequest if succeed or fail using pullRequestId
         * */
        if (artifact.name.includes("Code Coverage Report")) {
          // function that will scan the Code Coverage Report_1234 artifact
        } else if (artifact.name == ArtifactsName.contributors) {
          // scan the contributors artifact
        } else if (artifact.name == ArtifactsName.dependencyCheck) {
          // scan the dependency check
        } else if (artifact.name == ArtifactsName.resharper) {
          // scan the resharper artifact
        } else if (artifact.name == ArtifactsName.scanResults) {
          // scan the scan results artifact that has the AquaSecurity.json
        } else if (artifact.name == ArtifactsName.testResults) {
          // scan the test results artifact
        }
      }
    });
  } catch (e) {
    newContext.log(e.message);
  }
};

const downloadArtifact = async (artifactUrl: string): Promise<Buffer> => {
  try {
    return await getArtifactBuffer(artifactUrl);
  } catch (e) {
    newContext.log(e.message);
  }
};
