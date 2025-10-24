import { Component, inject, linkedSignal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { AddWorkflowButton } from '../../../add-workflow-button';
import { ApprovalWorkflowComponent } from '../approval/approval-workflow';
import { ApprovalWorkflow } from '../../data-access/models/approval-workflow.model';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';

@Component({
  selector: 'approval-records',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      @for(approval of form.approvals; track $index){
        <approval-workflow 
          [state]="approval().value()"
          (saveApproval)="updateApproval($event)" 
          (deleteApproval)="deleteApproval($event)" 
        />
      }
    </div>

    <add-workflow-button (saveNewApproval)="addApproval($event)" />
  `,
  imports: [ApprovalWorkflowComponent, AddWorkflowButton],
  host: {
    'class': 'block px-8 py-6'
  }
})
export class ApprovalRecords {
  private readonly workflowService = inject(ApprovalWorkflowService);

  readonly formState = linkedSignal(() => this.workflowService.cachedApprovals());

  readonly form = form<{ approvals: ApprovalWorkflow[] }>(this.formState);

  addApproval(approval: ApprovalWorkflow): void {
    this.workflowService.addApproval(approval, this.form);
  }
  
  updateApproval(approval: ApprovalWorkflow): void {
    this.workflowService.updateApproval(approval, this.form);
  }
  
  deleteApproval(approvalId: string): void {
    this.workflowService.deleteApproval(approvalId, this.form);
  }
}
