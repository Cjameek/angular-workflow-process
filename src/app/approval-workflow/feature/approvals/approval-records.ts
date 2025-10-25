import { Component, inject } from '@angular/core';

import { ApprovalWorkflowComponent } from '../approval/approval-workflow';
import { ApprovalWorkflow } from '../../data-access/models/approval-workflow.model';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';
import { ApprovalTableComponent } from '../approval-table/approval-table';

@Component({
  selector: 'approval-records',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      @for(approval of approvals(); track $index){
        <approval-workflow 
          [state]="approval"
          (cancelApproval)="cancelChanges()"
          (saveApproval)="processApproval($event)" 
          (deleteApproval)="deleteApproval($event)" 
        />
      }
    </div>

    <approval-table />
  `,
  imports: [ApprovalWorkflowComponent, ApprovalTableComponent],
  host: {
    'class': 'block px-8 py-6'
  }
})
export class ApprovalRecords {
  private readonly workflowService = inject(ApprovalWorkflowService);
  readonly approvals = this.workflowService.approvals;

  cancelChanges(): void {
    // Clear any staged approvals
    this.workflowService.stagedApproval.set(null);
  }

  processApproval(approval: ApprovalWorkflow): void {
    if(approval.id == null){
      return this.workflowService.addApproval(approval);
    }
      
    return this.workflowService.updateApproval(approval);
  }
  
  deleteApproval(approvalId: string): void {
    this.workflowService.deleteApproval(approvalId);
  }
}
