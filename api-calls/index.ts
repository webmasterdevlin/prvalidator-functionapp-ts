import { Vote } from "../models/ApprovePullRequest";
import { Context } from "@azure/functions";
import fetch from "node-fetch";
import { StatusPolicy } from "../models/StatusPolicy";
import { headers } from "../utils";

export const updateStatusPolicy = async (
  statusPolicy: StatusPolicy,
  accountName: string,
  resourceRepositoryProjectName: string,
  resourceRepositoryName: string,
  resourcePullRequestId: number,
  context?: Context
) => {
  const url = `https://dev.azure.com/${accountName}/${resourceRepositoryProjectName}/_apis/git/repositories/${resourceRepositoryName}/pullrequests/${resourcePullRequestId}/statuses?api-version=5.0-preview.1`;
  context.log("updateStatusPolicy()");
  const method = "POST";
  const body = JSON.stringify(statusPolicy);

  try {
    return await (await fetch(url, { method, body, headers })).json();
  } catch (e) {
    context.log(e);
  }
};

export const getRepository = async (
  accountName: string,
  resourceContainersProjectId: string,
  context?: Context
) => {
  const url = `https://dev.azure.com/${accountName}/${resourceContainersProjectId}/_apis/git/repositories?api-version=5.1`;

  try {
    return await (await fetch(url, { headers })).json();
  } catch (e) {
    context.log(e);
  }
};

export const getGitPullRequestResources = async (
  accountName: string,
  resourceContainersProjectId: string,
  repositoryId: string,
  context?: Context
) => {
  const url = `https://dev.azure.com/${accountName}/${resourceContainersProjectId}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=5.1`;

  try {
    return await (await fetch(url, { headers })).json;
  } catch (e) {
    context.log(e);
  }
};

export const sendFeedback = async (
  accountName: string,
  resourceContainersProjectId: string,
  repositoryId: string,
  resourcePullRequestId: number,
  resourceRequestsRequestedForId: string,
  vote: Vote,
  context?: Context
) => {
  const url = `https://${accountName}.visualstudio.com/${resourceContainersProjectId}/_apis/git/repositories/${repositoryId}/pullRequests/${resourcePullRequestId}/reviewers/${resourceRequestsRequestedForId}?api-version=5.0-preview.1`;
  const method = "PUT";
  const body = JSON.stringify(vote);

  try {
    return await (await fetch(url, { method, body, headers })).json;
  } catch (e) {
    context.log(e);
  }
};
