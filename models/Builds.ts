export type Self = {
  href: string;
};

export type Web = {
  href: string;
};

export type SourceVersionDisplayUri = {
  href: string;
};

export type Timeline = {
  href: string;
};

export type Badge = {
  href: string;
};

export type Links = {
  self: Self;
  web: Web;
  sourceVersionDisplayUri: SourceVersionDisplayUri;
  timeline: Timeline;
  badge: Badge;
};

export type Properties = {};

export type ValidationResult = {
  result: string;
  message: string;
};

export type Plan = {
  planId: string;
};

export type TriggerInfo = {
  prNumber: string;
  prIsFork: string;
  ciSourceSha: string;
  ciTriggerRepository: string;
  ciSourceBranch: string;
  ciMessage: string;
};

export type Definition = {
  drafts: any[];
  id: number;
  name: string;
  url: string;
  uri: string;
  path: string;
  type: string;
  queueStatus: string;
  revision: number;
  project: Project;
};

export type Project = {
  id: string;
  name: string;
  url: string;
  state: string;
  revision: number;
  visibility: string;
  lastUpdateTime: Date;
};

export type Project2 = {
  id: string;
  name: string;
  url: string;
  state: string;
  revision: number;
  visibility: string;
  lastUpdateTime: Date;
};

export type Pool = {
  id: number;
  name: string;
  isHosted: boolean;
};

export type Queue = {
  id: number;
  name: string;
  pool: Pool;
};

export type Avatar = {
  href: string;
};

export type Links2 = {
  avatar: Avatar;
};

export type RequestedFor = {
  displayName: string;
  url: string;
  _links: Links2;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
};

export type Avatar2 = {
  href: string;
};

export type Links3 = {
  avatar: Avatar2;
};

export type RequestedBy = {
  displayName: string;
  url: string;
  _links: Links3;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
};

export type Avatar3 = {
  href: string;
};

export type Links4 = {
  avatar: Avatar3;
};

export type LastChangedBy = {
  displayName: string;
  url: string;
  _links: Links4;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
};

export type OrchestrationPlan = {
  planId: string;
};

export type Logs = {
  id: number;
  type: string;
  url: string;
};

export type Repository = {
  id: string;
  type: string;
  name: string;
  url: string;
  clean?: any;
  checkoutSubmodules: boolean;
};

export type Build = {
  _links: Links;
  properties: Properties;
  tags: any[];
  validationResults: ValidationResult[];
  plans: Plan[];
  triggerInfo: TriggerInfo;
  id: number;
  buildNumber: string;
  status: string;
  result: string;
  queueTime: Date;
  startTime: Date;
  finishTime: Date;
  url: string;
  definition: Definition;
  buildNumberRevision: number;
  project: Project2;
  uri: string;
  sourceBranch: string;
  sourceVersion: string;
  queue: Queue;
  priority: string;
  reason: string;
  requestedFor: RequestedFor;
  requestedBy: RequestedBy;
  lastChangedDate: Date;
  lastChangedBy: LastChangedBy;
  parameters: string;
  orchestrationPlan: OrchestrationPlan;
  logs: Logs;
  repository: Repository;
  keepForever: boolean;
  retainedByRelease: boolean;
  triggeredByBuild?: any;
};

export type Builds = {
  count: number;
  value: Build[];
};
