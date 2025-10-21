import { Component, output, signal } from '@angular/core';
import { ApprovalWorkflow } from './approval-workflow.model';
import { createNewApprovalWorkflowState } from './app';
import { ApprovalWorkflowComponent } from './approval-workflow';

@Component({
  selector: 'add-workflow-button',
  template: `
    @let tempApproval = stagingApproval();
    @if(!tempApproval){
      <button 
      type="button" 
      class="block w-full text-center bg-transparent border-2 border-dashed border-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
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
    this.stagingApproval.set(createNewApprovalWorkflowState());
  }

  saveStagedApproval(approval: ApprovalWorkflow): void {
    this.saveNewApproval.emit(approval);
    this.stagingApproval.set(null);
  }
}
