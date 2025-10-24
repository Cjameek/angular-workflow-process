import { User } from "../../../shared/data-access/models/user-model";
import { RequirementStatus } from "./approval-workflow.model";

export interface Approver {
  id: string,
  requirementStatus: RequirementStatus,
  type: 'USER' | 'ROLE',
  user: User | null,
  role: string | null
}