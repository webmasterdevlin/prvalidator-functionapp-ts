export const checkContributors = (artifact: Buffer, { log }: any) => {
  log("checkContributors");
  log("Artifact_Buffer = ", artifact);
  log("Buffer_toString = ", artifact.toString());

  return true;
};
