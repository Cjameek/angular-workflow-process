import { Component, computed, inject, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

import { EmptySelectionArea } from '../../../shared/ui/empty-selection-list/empty-selection-area';
import { ApproversList } from '../../ui/approvers-list/approvers-list';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';
import { User } from '../../../shared/data-access/models/user-model';
import { Approver } from '../../data-access/models/approver-model';
import { DialogService } from '../../data-access/services/dialog-service';

@Component({
  selector: 'workflow-approvers',
  template: `
    <section>
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Approvers ({{ approvers()().value().length }})</h3>

        @if(editing()){
          <button 
            type="button" 
            class="flex justify-center items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer" 
            (click)="openDialog()"
          >
            <span class="flex justify-center h-[10px]">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
              </svg>
            </span>
            <span>Add Approver</span>
          </button>
        }
      </div>
      @if(approvers()().value().length > 0){
        <approvers-list [approvers]="approvers()().value()" />
      } @else {
        <empty-selection-area [title]="'No approvers assigned'">
          <span beforeTitle class="flex justify-center text-gray-400 text-xl mb-2 h-[1em]">
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
            </svg>
          </span>
          <button afterTitle type="button" class="btn secondary" (click)="openDialog()">Add Approver</button>
        </empty-selection-area>
      }
    </section>
  `,
  imports: [ApproversList, EmptySelectionArea],
})
export class WorkflowApprovers {
  private readonly dialogService = inject(DialogService);
  readonly approvers = input.required<FieldTree<Approver[], string | number>>();
  readonly editing = input<boolean>(false);
  readonly users = input<User[]>([
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-0101' },
    { name: 'Bob Martinez', email: 'bob.martinez@example.com', phone: '555-0102' },
    { name: 'Charlie Kim', email: 'charlie.kim@example.com', phone: '555-0103' },
    { name: 'Dana Lee', email: 'dana.lee@example.com', phone: '555-0104' }
  ]);
  
  readonly roles = input<string[]>(['ADMIN','REVIEWER','SUBMITTER','PLANNER','ENGINEER']);

  readonly availableUsers = computed(() => ApprovalWorkflowUtils.getRemainingUsersFromApprovals(this.approvers()().value(), this.users()));
  readonly availableRoles = computed(() => ApprovalWorkflowUtils.getRemainingRolesFromApprovals(this.approvers()().value(), this.roles()));

  addApprover(approver: Approver): void {
    const key = Date.now().toString();

    if(this.approvers()().value().length > 0){
      this.approvers()().value.update((arr) => [...arr, approver]);
      return;
    }
    
    this.approvers()().value.set([approver]);
  }

  removeApprover(approver: Approver): void {
    const filteredArr = this.approvers()().value().filter((val) => val.id != approver.id);

    this.approvers()().value.set(filteredArr);
  }

  openDialog(approver?: Approver): void {
    this.dialogService.openAddApproverDialog(
      approver,
      this.availableUsers(),
      this.availableRoles(),
    ).subscribe(approver => this.addApprover(approver));
  }
}