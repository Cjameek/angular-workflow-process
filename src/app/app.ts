import { Component, inject, linkedSignal, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { ApprovalWorkflowComponent } from './approval-workflow';
import { ApprovalWorkflow } from './approval-workflow.model';
import { AddWorkflowButton } from './add-workflow-button';
import { WorkflowPageHeader } from './workflow-page-header';
import { ApprovalWorkflowService } from './approval-workflow-service';

export const createNewApprovalWorkflowState = (): ApprovalWorkflow => {
  return {
    id: null,
    title: '',
    rules: [],
    approvers: [],
    prevApproval: null,
    nextApproval: null
  } as ApprovalWorkflow
}

const DUMMY_APPROVAL = {
  id: "TESTA",
  title: "TESTA",
  rules: [
    {
      id: "1760740782339",
      requirementStatus: "REQUIRE",
      assignmentCondition: "AND",
      comparisonOperator: null,
      property: {
        recordType: "order",
        name: "specialPart",
        type: "boolean"
      },
      value: "TRUE"
    }
  ],
  approvers: [
    {
      id: "1760740788461",
      requirementStatus: "REQUIRE",
      type: "USER",
      user: {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "555-0101"
      },
      role: null
    }
  ],
  prevApproval: null,
  nextApproval: null
} as ApprovalWorkflow

@Component({
  selector: 'app-root',
  template: `
  <workflow-page-header [records]="form.approvals().value()" />

  <main class="px-8 py-6">
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
  </main>
  `,
  imports: [ApprovalWorkflowComponent, AddWorkflowButton, WorkflowPageHeader]
})
export class App {
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
