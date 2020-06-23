import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Artifacts, ArtifactsName } from "../models/Artifacts";
import { getArtifactBuffer, getArtifacts, getBuilds } from "../api-calls";
import { BuildCompleted } from "../models/webhooks/BuildCompleted";
import {
  checkAquaScanner,
  checkContributors,
  checkDependency,
  checkResharperReport,
  checkTestResult,
} from "../validators";
import { checkCodeCoverage } from "../validators/code-coverage.validator";

/* Application settings */
const ACCOUNT = process.env.ACCOUNT;
const ACCESS_KEY = process.env.ACCESS_KEY;

let clonedContext: Context;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  clonedContext = context;
  try {
    const buildCompleted = req.body as BuildCompleted;
    const buildResourceId = buildCompleted.resource.id;
    const projectId = buildCompleted.resourceContainers.project.id;

    const builds = await getBuilds(projectId);
    const build = builds.value.find((build) => build.id === buildResourceId);

    const pullRequestId = build.triggerInfo["pr.number"];
    context.log("Pull Request ID is = ", pullRequestId);
    context.log("Build Completed ID is = ", buildResourceId);

    try {
      await fetchArtifacts(projectId, buildResourceId);
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
  buildResourceId: number
): Promise<void> => {
  clonedContext.log("fetchArtifacts");
  try {
    const artifacts = await getArtifacts(projectId, buildResourceId);
    await downloadArtifacts(artifacts);
  } catch (e) {
    clonedContext.log(e.message);
  }
};

const downloadArtifacts = async (artifacts: Artifacts): Promise<void> => {
  clonedContext.log("downloadArtifacts");
  try {
    artifacts.value.map(async (artifact) => {
      const url = artifact.resource.downloadUrl;
      if (url) {
        const artifactToBeScanned = await downloadArtifact(url);
        clonedContext.log("URL = ", url);
        /*
         * TODO: Scan each artifact here
         * Use a function that will scan the artifact
         * or upload the artifact then BlobTrigger a Function App that will scan this artifact
         * The first approach is much simpler
         * Update PullRequest if succeed or fail using pullRequestId
         * */
        if (artifact.name.includes("Code Coverage Report")) {
          await checkCodeCoverage(artifactToBeScanned);
        } else if (artifact.name == ArtifactsName.contributors) {
          await checkContributors(artifactToBeScanned, clonedContext);
        } else if (artifact.name == ArtifactsName.dependencyCheck) {
          await checkDependency(artifactToBeScanned);
        } else if (artifact.name == ArtifactsName.resharper) {
          await checkResharperReport(artifactToBeScanned);
        } else if (artifact.name == ArtifactsName.scanResults) {
          await checkAquaScanner(artifactToBeScanned);
        } else if (artifact.name == ArtifactsName.testResults) {
          await checkTestResult(artifactToBeScanned);
        }
      }
    });
  } catch (e) {
    clonedContext.log(e.message);
  }
};

const downloadArtifact = async (artifactUrl: string): Promise<Buffer> => {
  try {
    return await getArtifactBuffer(artifactUrl);
  } catch (e) {
    clonedContext.log(e.message);
  }
};
