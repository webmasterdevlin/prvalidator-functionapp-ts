export class StatusPolicy {
  context = new Context();
  constructor(
    public state: State,
    public description: Description,
    public targetUrl = "https://visualstudio.microsoft.com"
  ) {}
}

export class Context {
  constructor(
    public name = "PullRequest-WIT-App",
    public genre = "pr-azure-function-ci"
  ) {}
}

export enum State {
  succeeded = "succeeded",
  failed = "failed",
  pending = "pending",
  error = "error",
}

export enum Description {
  succeeded = "build succeeded",
  failed = "build failed",
  pending = "work in progress",
  error = "build error",
}

export interface Status {
  id: number;
  state: string;
  description: string;
  context: Context;
  creationDate: Date;
  updatedDate: Date;
}
