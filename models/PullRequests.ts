export type Project = {
  id: string;
  name: string;
  state: string;
  visibility: string;
  lastUpdateTime: Date;
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  project: Project;
};

export type Avatar = {
  href: string;
};

export type Links = {
  avatar: Avatar;
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
  url: string;
};

export type Avatar2 = {
  href: string;
};

export type Links2 = {
  avatar: Avatar2;
};

export type Reviewer = {
  reviewerUrl: string;
  vote: Vote;
  hasDeclined: boolean;
  isFlagged: boolean;
  displayName: string;
  url: string;
  _links: Links2;
  id: string;
  uniqueName: string;
  imageUrl: string;
};

export enum Vote {
  approve = 10,
  approveWithSuggestions = 5,
  waitForAuthor = -5,
  reject = -10,
  declineToReview = 0,
}

export type CompletionOptions = {
  mergeCommitMessage: string;
  deleteSourceBranch: boolean;
  mergeStrategy: string;
  bypassReason: string;
  transitionWorkItems: boolean;
  autoCompleteIgnoreConfigIds: any[];
};

export type PullRequest = {
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
  reviewers: Reviewer[];
  url: string;
  supportsIterations: boolean;
  completionOptions: CompletionOptions;
};

export type PullRequests = {
  value: PullRequest[];
  count: number;
};
