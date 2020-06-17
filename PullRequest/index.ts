import { AzureFunction, Context, HttpRequest } from "@azure/functions";

/*
 * function
 * /api/PullRequest
 * */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("TypeScript HTTP trigger function processed a request.");
  context.log(req);

  /*
  context.res = {
    body: "PullRequest works!",
  };
  */

  let pullRequestId = +req.body.resource.pullRequestId;
  let pullRequestTitle = req.body.resource.title;

  context.log(
    "Service Hook Received for PR: " + pullRequestId + " " + pullRequestTitle
  );

  context.res = {
    id: pullRequestId,
    title: pullRequestTitle,
  };
};

export default httpTrigger;
