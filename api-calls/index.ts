import axios from "axios";

import { Status, StatusPolicy } from "../models/StatusPolicy";
import { headers } from "../utils";
import { PullRequests } from "../models/PullRequests";
import { Repositories } from "../models/Repositories";
import { Artifacts } from "../models/Artifacts";

const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

export const updateStatusPolicy = async (
  statusPolicy: StatusPolicy,
  repositoryProjectName: string,
  repositoryName: string,
  pullRequestId: number
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${repositoryProjectName}/_apis/git/repositories/${repositoryName}/pullrequests/${pullRequestId}/statuses?api-version=5.0-preview.1`;

  try {
    return await axios.post<Status>(url, statusPolicy, { headers });
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getArtifacts = async (projectId: string, buildId: string) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/Builds/${buildId}/artifacts?api-version=5.1`;

  try {
    return await axios.get<Artifacts>(url, { headers });
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getRepositories = async (containersProjectId: string) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${containersProjectId}/_apis/git/repositories?api-version=5.1`;

  try {
    return await axios.get<Repositories>(url, { headers });
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getPullRequests = async (
  containersProjectId: string,
  repositoryId: string
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${containersProjectId}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=5.1`;

  try {
    return await axios.get<PullRequests>(url, { headers });
  } catch (e) {
    throw new Error(e.message);
  }
};
