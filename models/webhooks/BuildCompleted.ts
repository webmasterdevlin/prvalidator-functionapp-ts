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
  customData: CustomData;
};

type CustomData = {
  executionTimeMs: any;
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

export type Drop = {
  location: string;
  type: string;
  url: string;
  downloadUrl: string;
};

export type Log = {
  type: string;
  url: string;
  downloadUrl: string;
};

export type LastChangedBy = {
  displayName: string;
  url: string;
  id: string;
  uniqueName: string;
  imageUrl: string;
};

export type Definition = {
  batchSize: number;
  triggerType: string;
  definitionType: string;
  id: number;
  name: string;
  url: string;
};

export type Queue = {
  queueType: string;
  id: number;
  name: string;
  url: string;
};

export type RequestedFor = {
  displayName: string;
  url: string;
  id: string;
  uniqueName: string;
  imageUrl: string;
};

export type Request = {
  id: number;
  url: string;
  requestedFor: RequestedFor;
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
  dropLocation: string;
  drop: Drop;
  log: Log;
  sourceGetVersion: string;
  lastChangedBy: LastChangedBy;
  retainIndefinitely: boolean;
  hasDiagnostics: boolean;
  definition: Definition;
  queue: Queue;
  requests: Request[];
};

export type Collection = {
  id: string;
};

export type Account = {
  id: string;
};

export type Project = {
  id: string;
};

export type ResourceContainers = {
  collection: Collection;
  account: Account;
  project: Project;
};
