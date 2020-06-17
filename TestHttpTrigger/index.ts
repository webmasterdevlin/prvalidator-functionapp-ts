import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BuildCompleted } from "../models/webhooks/BuildCompleted";
import { Description, State, StatusPolicy } from "../models/StatusPolicy";
import { Vote } from "../models/ApprovePullRequest";
import {
  GitPullRequestResources,
  GitRepositories,
  PullRequestCreated,
} from "../models/webhooks/PullRequestCreated";
import {
  getGitPullRequestResources,
  getRepository,
  sendFeedback,
  updateStatusPolicy,
} from "../api-calls";

const accountName = process.env.ACCOUNT_NAME;

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    context.log("Service Hook Received");

    const prData = req.body as PullRequestCreated;
    const buildData = req.body as BuildCompleted;

    context.log("PULL_REQUEST_DATA", prData);
    context.log("BUILD_COMPLETED_DATA", buildData);

    context.log("Data Received: " + JSON.stringify(req.body));

    if (prData.resource.createdBy) {
      context.log(
        "################ PullRequestCreated Webhook Triggered ################"
      );

      const statusPolicy = new StatusPolicy(
        State.succeeded,
        Description.succeeded
      );
      context.log(
        `https://dev.azure.com/${accountName}/${prData.resource.repository.project.name}/_apis/git/repositories/${prData.resource.repository.name}/pullrequests/${prData.resource.pullRequestId}/statuses?api-version=5.0-preview.1`
      );

      const status = await updateStatusPolicy(
        statusPolicy,
        accountName,
        prData.resource.repository.project.name,
        prData.resource.repository.name,
        prData.resource.pullRequestId,
        context
      );

      context.log("STATUS::", status);
    } else if (buildData.resource.buildNumber) {
      context.log(
        "################ BuildCompleted Webhook Triggered ################"
      );
      const projectId = buildData.resourceContainers.project.id;

      const gitRepositories: any = await getRepository(
        accountName,
        projectId,
        context
      );

      context.log("DATA", gitRepositories);
      context.log("GIT REPOSITORY::", JSON.stringify(gitRepositories.value));
      context.log(
        `MyURL2:: https://dev.azure.com/${accountName}/${projectId}/_apis/git/repositories/${gitRepositories.value[0].id}/pullrequests?api-version=5.1`
      );

      const resources: any = await getGitPullRequestResources(
        accountName,
        projectId,
        gitRepositories.value[0].id,
        context
      );

      context.log("GIT RESOURCE COUNT::", resources.count);
      context.log(
        `FEED_BACK_URL:: https://${accountName}.visualstudio.com/${projectId}/_apis/git/repositories/${gitRepositories.value[0].id}/pullRequests/${resources.value[0].pullRequestId}/reviewers/${buildData.resource.requests[0].requestedFor.id}?api-version=5.0-preview.1`
      );

      const feedback = await sendFeedback(
        accountName,
        projectId,
        gitRepositories.value[0].id,
        resources.value[0].pullRequestId,
        buildData.resource.requests[0].requestedFor.id,
        Vote.approve,
        context
      );
      context.log("FEEDBACK DATA:", feedback);
    } else {
      context.log(
        "Failed to parse the pull request id from the service hooks payload."
      );
    }

    context.res = {
      status: 200,
    };
  } catch (e) {
    context.log(e);
    context.res = {
      status: 500,
      body: "Internal Server Error",
    };
  }
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default httpTrigger;
