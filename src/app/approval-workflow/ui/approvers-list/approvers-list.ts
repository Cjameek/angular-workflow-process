import { Component, computed, input } from '@angular/core';
import { UserList } from '../user-list/user-list';
import { RoleList } from '../role-list/role-list';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';
import { User } from '../../../shared/data-access/models/user-model';
import { Approver } from '../../data-access/models/approver-model';

@Component({
  selector: 'approvers-list',
  template: `
    @if(users().length > 0){
      <user-list [users]="users()" />
    }

    @if(roles().length > 0){
      <role-list [roles]="roles()" />
    }
  `,
  host: {
    'class': 'flex flex-col gap-3',
  },
  imports: [UserList, RoleList],
})
export class ApproversList {
  readonly approvers = input<Approver[]>([]);

  readonly users = computed<User[]>(() => ApprovalWorkflowUtils.getSelectedUsersFromApprovals(this.approvers()));
  readonly roles = computed<string[]>(() => ApprovalWorkflowUtils.getSelectedRolesFromApprovals(this.approvers()));
}
