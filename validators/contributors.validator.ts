import { updateStatusPolicy } from "../api-calls";
import { Description, State, StatusPolicy } from "../models/StatusPolicy";

export const checkContributors = async (
  artifact: string,
  projectId: string,
  repositoryId: string,
  pullRequestId: string,
  { log }: any
) => {
  log("checkContributors");
  log("Artifact = ", artifact);

  let statusPolicy = new StatusPolicy();

  if (artifact) {
    const fileExists = artifact.includes("contributors.md");
    statusPolicy.state = fileExists ? State.succeeded : State.failed;

    statusPolicy.description = fileExists
      ? Description.succeeded
      : Description.failed;
  } else {
    statusPolicy.state = State.failed;
    statusPolicy.description = Description.failed;
  }
  log(`${statusPolicy.state} ${statusPolicy.description}`);
  await updateStatusPolicy(
    statusPolicy,
    projectId,
    repositoryId,
    pullRequestId,
    log
  );
};
