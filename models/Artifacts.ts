export type Artifacts = {
  count: number;
  value: Artifact[];
};

export type Properties = {
  localpath: string;
  artifactsize: string;
};

export type Resource = {
  type: string;
  data: string;
  properties: Properties;
  url: string;
  downloadUrl: string;
};

export type Artifact = {
  id: number;
  name: string;
  source: string;
  resource: Resource;
};
