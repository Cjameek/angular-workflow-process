import { Component, output, signal } from '@angular/core';
import { ApprovalWorkflow } from './approval-workflow/data-access/models/approval-workflow.model';
import { ApprovalWorkflowComponent } from './approval-workflow/feature/approval/approval-workflow';
import { ApprovalWorkflowUtils } from './approval-workflow/utils/approval-workflow-utils';

@Component({
  selector: 'add-workflow-button',
  template: `
    @let tempApproval = stagingApproval();
    @if(!tempApproval){
      <button 
      type="button" 
      class="btn"
      (click)="stageApproval()">
        + Add Approval
      </button>
    } @else {
      <approval-workflow 
        [isNewApproval]="true" 
        [state]="tempApproval" 
        (cancelApproval)="stagingApproval.set(null)" 
        (saveApproval)="saveStagedApproval($event)" 
      />
    }
  `,
  imports: [ApprovalWorkflowComponent],
})
export class AddWorkflowButton {
  readonly stagingApproval = signal<ApprovalWorkflow | null>(null);
  readonly saveNewApproval = output<ApprovalWorkflow>();

  stageApproval(): void {
    this.stagingApproval.set(ApprovalWorkflowUtils.createNewApprovalWorkflowState());
  }

  saveStagedApproval(approval: ApprovalWorkflow): void {
    this.saveNewApproval.emit(approval);
    this.stagingApproval.set(null);
  }
}
