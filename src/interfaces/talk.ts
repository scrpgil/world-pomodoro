import { DocumentReference } from "./firebase";
export interface ITalk {
  id: string;
  num: number;
  status: number;
  uid: string;
  body: string;
  displayCreatedAt: string;
  createdAt: Date;
  user: { ref: DocumentReference };
}
