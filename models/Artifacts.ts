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

export type Artifacts = {
  count: number;
  value: Artifact[];
};

export enum ArtifactsName {
  coneCoverage = "Code Coverage",
  contributors = "contributors",
  databaseMigrations = "Database migrations",
  dependencyCheck = "dependency check",
  drop = "drop",
  helmDeploy = "helm deploy artifact",
  loadTests = "load-tests",
  integrationTestResults = "integration test results",
  nuget = "nuget",
  resharper = "resharper",
  scanResults = "scan results",
  testResults = "test results",
}
