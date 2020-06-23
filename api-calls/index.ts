import axios from "axios";
import { Status, StatusPolicy } from "../models/StatusPolicy";
import { headers } from "../utils";
import { PullRequests } from "../models/PullRequests";
import { Repositories } from "../models/Repositories";
import { Artifacts, Artifact } from "../models/Artifacts";
import { Build, Builds } from "../models/Builds";

const zlib = require("zlib");

const ACCOUNT_NAME = process.env.ACCOUNT_NAME;

export const updateStatusPolicy = async (
  statusPolicy: StatusPolicy,
  projectId: string,
  repositoryId: string,
  pullRequestId: number
) => {
  const url = `https://dev.azure.com/${ACCOUNT_NAME}/${projectId}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}/statuses?api-version=5.0-preview.1`;

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

export const getArtifactBuffer = async (artifactUrl: string, { log }: any) => {
  log("getArtifactBuffer");
  try {
    const { data }: any = await axios.get<any>(artifactUrl, {
      responseType: "json",
      headers,
    });
    const stream: any = await axios.get<any>(artifactUrl, {
      responseType: "stream",
      headers,
    });
    const blob: any = await axios.get<any>(artifactUrl, {
      responseType: "blob",
      headers,
    });

    const { data: buffer }: any = await axios.get<any>(artifactUrl, {
      responseType: "arraybuffer",
      headers,
    });

    const docs = await axios.get<any>(artifactUrl, {
      responseType: "document",
      headers,
    });

    log("getArtifactBuffer_data_string_data = ", data.toString());
    log("getArtifactBuffer_data = ", data);

    log("getArtifactBuffer_data_string_stream = ", stream.toString());
    log("getArtifactBuffer_data_stream = ", stream);

    log("getArtifactBuffer_data_string_blob = ", blob.toString());
    log("getArtifactBuffer_data_blob = ", blob);

    log("getArtifactBuffer_data_string_buffer = ", buffer.toString());
    log("getArtifactBuffer_data_buffer = ", buffer);

    log("getArtifactBuffer_data_string_buffer = ", docs.toString());
    log("getArtifactBuffer_data_buffer = ", docs);

    return Buffer.from(data);
  } catch (e) {
    log("ERROR : ", e);
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
