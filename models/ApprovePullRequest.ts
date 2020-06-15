export class ApprovePullRequest {
  displayName: string;
  hasDeclined = false;
  id: string;
  imageUrl: string;
  isFlagged = false;
  reviewerUrl: string;
  uniqueName: string;
  url: string;
  vote: Vote;
  _links: _Links;
}

export enum Vote {
  approve = 10,
  approveWithSuggestions = 5,
  waitForAuthor = -5,
  reject = -10,
  declineToReview = 0,
}

export class _Links {
  avatar: Avatar;
}

export class Avatar {
  href: string;
}
