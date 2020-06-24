import axios from "axios";
import { Status, StatusPolicy } from "../models/StatusPolicy";
import { headers } from "../utils";
import { PullRequests } from "../models/PullRequests";
import { Repositories } from "../models/Repositories";
import { Artifacts, Artifact } from "../models/Artifacts";
import { Build, Builds } from "../models/Builds";

const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

export const updateStatusPolicy = async (
  statusPolicy: StatusPolicy,
  projectId: string,
  repositoryId: string,
  pullRequestId: string,
  log: any
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}/statuses?api-version=5.0-preview.1`;
  log("URL::", url);
  try {
    return await axios.post<Status>(url, statusPolicy, { headers });
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getArtifacts = async (
  projectId: string,
  buildResourceId: number
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/Builds/${buildResourceId}/artifacts?api-version=5.1`;

  try {
    const { data } = await axios.get<Artifacts>(url, { headers });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getArtifactContent = async (artifactUrl: string, { log }: any) => {
  log("getArtifactContent");
  try {
    const data =
      'PK\u0003\u0004\u0014\u0000\u0000\u0000\u0000\u0000H*�P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\r\u0000\u0000\u0000contributors/PK\u0003\u0004\u0014\u0000\b\u0000\b\u0000H*�P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u001c\u0000\u0000\u0000contributors/contributors.mdsI-���SpQP�r�2KsRJs\u0012�"\u0000PK\u0007\bI��B\u0018\u0000\u0000\u0000\u001d\u0000\u0000\u0000PK\u0001\u0002\u0014\u0000\u0014\u0000\u0000\u0000\u0000\u0000H*�P\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\r\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000contributors/PK\u0001\u0002\u0014\u0000\u0014\u0000\b\u0000\b\u0000H*�PI��B\u0018\u0000\u0000\u0000\u001d\u0000\u0000\u0000\u001c\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000+\u0000\u0000\u0000contributors/contributors.mdPK\u0005\u0006\u0000\u0000\u0000\u0000\u0002\u0000\u0002\u0000�\u0000\u0000\u0000�\u0000\u0000\u0000\u0000\u0000';
    // const { data } = await axios.get<any>(
    //   "https://devlintest.blob.core.windows.net/mycontainer/contributors.zip"
    // );
    log("DATA::::", data);
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getPullRequestId = async (
  projectId: string,
  buildResourceId: number,
  context: any
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/Builds/${buildResourceId}/?api-version=5.1-preview`;
  try {
    const { data } = await axios.get<Build>(url, { headers });
    return data.triggerInfo["pr.number"];
  } catch (e) {
    throw new Error(e.message);
  }
};

export const directArtifactDownload = async (
  projectId: string,
  buildResourceId: number,
  artifactName: string
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/builds/${buildResourceId}/artifacts?artifactName=${artifactName}&api-version=5.1&%24format=zip`;

  try {
    const { data } = await axios.get<Artifact>(url, {
      responseType: "arraybuffer",
      headers,
    });
    return Buffer.from(data);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getRepositories = async (projectId: string) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/git/repositories?api-version=5.1`;

  try {
    const { data } = await axios.get<Repositories>(url, { headers });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getPullRequests = async (
  projectId: string,
  repositoryId: string
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=5.1`;

  try {
    const { data } = await axios.get<PullRequests>(url, { headers });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getBuilds = async (projectId: string) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/build/Builds/?api-version=5.1-preview`;

  try {
    const { data } = await axios.get<Builds>(url, { headers });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};
