import { Component, inject, signal } from '@angular/core';
import { AddWorkflowForm } from '../../ui/add-workflow-form/add-workflow-form';
import { ApprovalWorkflow } from '../../data-access/models/approval-workflow.model';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';

@Component({
  selector: 'add-workflow-page',
  template: `
    <h2 class="text-2xl font-semibold text-gray-90 mb-2">Add Workflow</h2>

    <add-workflow-form 
      [state]="data" 
      (cancelApproval)="cancel()" 
      (saveApproval)="save($event)" 
    />
  `,
  imports: [AddWorkflowForm],
})
export class AddWorkflowPage {
  readonly workflowService = inject(ApprovalWorkflowService);
  readonly data = this.workflowService.getApprovalDataFromRouteData();

  cancel(): void {
    this.routeHome();
  }

  save(approval: ApprovalWorkflow): void {
    this.workflowService.addApproval(approval);

    setTimeout(() => this.routeHome(), 500);
  }

  private routeHome(): void {
    this.workflowService.routeToApprovals();
  }
}
