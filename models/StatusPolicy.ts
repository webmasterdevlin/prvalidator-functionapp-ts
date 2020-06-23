export class StatusPolicy {
  context = new Context();
  constructor(
    public state: State = State.error,
    public description: Description = Description.error,
    public targetUrl = "https://visualstudio.microsoft.com"
  ) {}
}

export class Context {
  constructor(public name = "Context Name", public genre = "context-genre") {}
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
