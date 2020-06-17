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
    public name = "Pull Request Validering",
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
  succeeded = "pr succeeded",
  failed = "pr failed",
  pending = "work in progress",
  error = "error in pr validering",
}

export interface Status {
  id: number;
  state: string;
  description: string;
  context: Context;
  creationDate: Date;
  updatedDate: Date;
}
