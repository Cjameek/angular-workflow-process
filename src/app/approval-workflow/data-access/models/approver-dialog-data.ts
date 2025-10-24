import { User } from "../../../shared/data-access/models/user-model";
import { Approver } from "./approver-model";

export interface ApproverDialogData {
  approver: Approver | null,
  users: User[],
  roles: string[]
}