import { DocumentReference } from "./firebase";
export interface ITalk {
  body: string;
  createdAt: Date;
  user: { ref: DocumentReference };
}
