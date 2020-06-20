#### Stuck:

- The PullRequestCreated object is not available in the BuildCompleted webhook event. The Pull Request ID is needed to pass/fail a specific pullrequest.
- The PullRequestCreated object can be uploaded to Storage Account through writing it in a text or json file.

- But how the BuilCompleted event will know the exact uploaded pullrequest to read and update/decorate if it is succeeded or failed?

- The PullRequestCreated event does not have a property that is unique to its repository that can be used to name a file and use it by the BuilCompleted to read.

- The longest buildtime of the pipelines is 11 minutes. Reading the latest uploaded pullrequest can send inaccurate results because there can be more than one submitted pullrequest within 11 minutes.

#### Solution:

- Use the latest PullRequest, but developers cannot send another pullrequest after 15 minutes after sending a pullrequest. It is because the BuilCompleted webhook will get the newest PullRequestId, scan the latest artifacts, and pass/fail the latest PullRequestId.
- What if there were two pull-requests within 15 minutes? What will happen is that the function will scan the artifacts of the BuildCompleted webhook connected to the 1st pullrequest, but will pass/fail the 2nd pullrequest.

#### I was wondering why the Microsoft Engineers didn't include the PullRequestId in BuilCompleted event? Now I know why simply because the BuilCompleted event can also be triggered just by rerunning the pipeline and not needing any PullRequest submission.
