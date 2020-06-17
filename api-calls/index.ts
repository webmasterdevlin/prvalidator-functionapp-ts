import { Vote } from "../models/ApprovePullRequest";
import {
  GitPullRequestResources,
  GitRepositories,
} from "../models/webhooks/PullRequestCreated";
import { Context } from "@azure/functions";
import axios from "axios";

import { Status, StatusPolicy } from "../models/StatusPolicy";
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

  try {
    return await axios.post<Status>(url, statusPolicy, { headers });
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
    return await axios.get<GitRepositories>(url, { headers });
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
    return await axios.get<GitPullRequestResources>(url, { headers });
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

  try {
    return await axios.put<any>(url, { vote }, { headers });
  } catch (e) {
    context.log(e);
  }
};
