export type Context = {
  name: string;
  genre: string;
};

export type Avatar = {
  href: string;
};

export type Links = {
  avatar: Avatar;
};

export type CreatedBy = {
  displayName: string;
  url: string;
  _links: Links;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
};

export type Status = {
  iterationId: number;
  id: number;
  description: string;
  context: Context;
  creationDate: Date;
  updatedDate: Date;
  createdBy: CreatedBy;
  state: string;
};

export type Statuses = {
  value: Status[];
  count: number;
};
