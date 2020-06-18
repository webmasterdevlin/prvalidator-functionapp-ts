export type Message = {
  text: string;
  html: string;
  markdown: string;
};

export type DetailedMessage = {
  text: string;
  html: string;
  markdown: string;
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  project: Project;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  webUrl: string;
};

export type CreatedBy = {
  displayName: string;
  url: string;
  _links: Links;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
};

export type LastMergeSourceCommit = {
  commitId: string;
  url: string;
};

export type LastMergeTargetCommit = {
  commitId: string;
  url: string;
};

export type LastMergeCommit = {
  commitId: string;
  author: Author;
  committer: Committer;
  comment: string;
  url: string;
};

export type Author = {
  id: string;
};

export type Committer = {
  id: string;
};

export type Resource = {
  repository: Repository;
  pullRequestId: number;
  codeReviewId: number;
  status: string;
  createdBy: CreatedBy;
  creationDate: Date;
  title: string;
  description: string;
  sourceRefName: string;
  targetRefName: string;
  mergeStatus: string;
  isDraft: boolean;
  mergeId: string;
  lastMergeSourceCommit: LastMergeSourceCommit;
  lastMergeTargetCommit: LastMergeTargetCommit;
  lastMergeCommit: LastMergeCommit;
  reviewers: any[];
  url: string;
  _links: Links;
  supportsIterations: boolean;
  artifactId: string;
};

export type Links = {
  web: Web;
  statuses: Statuses;
};

export type Web = {
  id: string;
};

export type Statuses = {
  id: string;
};

export type Collection = {
  id: string;
  baseUrl: string;
};

export type Account = {
  id: string;
  baseUrl: string;
};

export type Project = {
  id: string;
  baseUrl: string;
};

export type ResourceContainers = {
  collection: Collection;
  account: Account;
  project: Project;
};

export type ParsedBlobBuffer = {
  subscriptionId: string;
  notificationId: number;
  id: string;
  eventType: string;
  publisherId: string;
  message: Message;
  detailedMessage: DetailedMessage;
  resource: Resource;
  resourceVersion: string;
  resourceContainers: ResourceContainers;
  createdDate: Date;
};
