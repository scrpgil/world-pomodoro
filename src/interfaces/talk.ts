import { DocumentReference } from "./firebase";
export enum StatusList {
  Normal = 0,
  Delete = 1,
  Edited = 2,
}
export interface ITalk {
  id?: string;
  num?: number;
  status?: StatusList;
  uid?: string;
  body?: string;
  displayCreatedAt?: string;
  createdAt?: Date;
  user?: { ref: DocumentReference };
}
