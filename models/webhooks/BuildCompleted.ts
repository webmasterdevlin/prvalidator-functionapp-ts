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

export type Drop = {};

export type Log = {};

export type LastChangedBy = {
  displayName: string;
  id: string;
  uniqueName: string;
};

export type Definition = {
  definitionType: string;
  id: number;
  name: string;
  url: string;
};

export type Resource = {
  uri: string;
  id: number;
  buildNumber: string;
  url: string;
  startTime: Date;
  finishTime: Date;
  reason: string;
  status: string;
  drop: Drop;
  log: Log;
  sourceGetVersion: string;
  lastChangedBy: LastChangedBy;
  retainIndefinitely: boolean;
  definition: Definition;
  requests: any[];
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

export type BuildCompleted = {
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
