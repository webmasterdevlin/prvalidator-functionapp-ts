export type PullRequestCreated = {
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

export type Project = {
  id: string;
  name: string;
  url: string;
  state: string;
  visibility: string;
  lastUpdateTime: Date;
};

export type CreatedBy = {
  displayName: string;
  url: string;
  id: string;
  uniqueName: string;
  imageUrl: string;
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
  url: string;
};

export type Reviewer = {
  reviewerUrl?: any;
  vote: number;
  displayName: string;
  url: string;
  id: string;
  uniqueName: string;
  imageUrl: string;
  isContainer: boolean;
};

export type Commit = {
  commitId: string;
  url: string;
};

export type Web = {
  href: string;
};

export type Statuses = {
  href: string;
};

export type Links = {
  web: Web;
  statuses: Statuses;
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  project: Project;
  defaultBranch: string;
  remoteUrl: string;
  sshUrl: string;
  webUrl: string;
};

export type GitRepositories = {
  value: Repository[];
  count: number;
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
  mergeId: string;
  lastMergeSourceCommit: LastMergeSourceCommit;
  lastMergeTargetCommit: LastMergeTargetCommit;
  lastMergeCommit: LastMergeCommit;
  reviewers: Reviewer[];
  commits: Commit[];
  url: string;
  _links: Links;
};

export type Collection = {
  id: string;
};

export type Account = {
  id: string;
};

export type Project2 = {
  id: string;
};

export type ResourceContainers = {
  collection: Collection;
  account: Account;
  project: Project2;
};

export type GitPullRequestResources = {
  value: Resource[];
  count: number;
};
