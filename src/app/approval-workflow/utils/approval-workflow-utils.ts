import { ApprovalWorkflow } from "../data-access/models/approval-workflow.model";
import { Approver } from "../data-access/models/approver-model";
import { User } from "../../shared/data-access/models/user-model";
import { Rule } from "../data-access/models/rule-model";

export class ApprovalWorkflowUtils {
  static createNewApprovalWorkflowState(): ApprovalWorkflow {
    return {
      id: null,
      title: '',
      rules: [],
      approvers: [],
      prevApproval: null,
      nextApproval: null
    } as ApprovalWorkflow
  }

  static getSelectedUsersFromApprovals(approvers: Approver[]): User[] {
    if(approvers.length > 0){
      return approvers.filter(a => a.type == 'USER').map(a => {
        if(a.user == null) throw new Error('User is null when approval type is \'USER\'');

        return a.user;
      });
    }

    return [];
  }

  static getRemainingUsersFromApprovals(approvers: Approver[], users: User[]): User[] {
    if(users.length > 0){
      if(approvers.length > 0){
        const usedNames = approvers.map(u => u.user?.name);
        return users.filter(u => !usedNames.includes(u.name));
      }

      return users;
    }

    return [];
  }

  static getSelectedRolesFromApprovals(approvers: Approver[]): string[] {
    if(approvers.length > 0){
      return approvers.filter(a => a.type == 'ROLE').map(a => {
        if(a.role == null) throw new Error('Role is null when approval type is \'ROLE\'');

        return a.role;
      });
    }

    return [];
  }

  static createNewApprover(id: string): Approver {
    return {
      id,
      requirementStatus: 'REQUIRE',
      type: 'USER',
      user: null,
      role: null
    } as Approver
  }

  static getRemainingRolesFromApprovals(approvers: Approver[], roles: string[]): string[] {
    if(roles.length > 0){
      if(approvers.length > 0){
        const usedNames = approvers.map(u => u.role);
        return roles.filter(r => !usedNames.includes(r));
      }

      return roles;
    }

    return [];
  }

  static createNewRule(id: string): Rule {
    return {
      id,
      description: '',
      requirementStatus: 'REQUIRE',
      assignmentCondition: 'AND',
      comparisonOperator: null,
      property: null,
      value: null
    } as Rule
  }
}