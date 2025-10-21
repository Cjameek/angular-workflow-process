import { Component, inject, linkedSignal, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { ApprovalWorkflowComponent } from './approval-workflow';
import { ApprovalWorkflow } from './approval-workflow.model';
import { LocalStorageService } from './local-storage-service';
import { AddWorkflowButton } from './add-workflow-button';

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

const LOCAL_STORAGE_KEY = 'approvals';

@Component({
  selector: 'app-root',
  template: `
    <main class="max-w-3xl m-6">
      <div class="flex flex-col gap-3 mb-6">
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
  imports: [ApprovalWorkflowComponent, AddWorkflowButton]
})
export class App {
  readonly localStorageService = inject(LocalStorageService);
  readonly cachedApprovals = signal<{ approvals: ApprovalWorkflow[] }>(this.localStorageService.getItem(LOCAL_STORAGE_KEY) || {
    approvals: []
  });

  // [TODO] simulate httpResource value 
  readonly formState = linkedSignal(() => this.cachedApprovals());

  readonly form = form<{ approvals: ApprovalWorkflow[] }>(this.formState);

  addApproval(approval: ApprovalWorkflow): void {
    approval.id = this.convertTitleStringToId(approval.title);

    this.form.approvals().value.update((arr) => [approval, ...arr]);

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, this.form().value());
  }
  
  updateApproval(approval: ApprovalWorkflow): void {
    this.form.approvals().value.update((arr) => {
      return arr.map((a) => {
        if(a.id == approval.id){
          return approval;
        }

        return a;
      });
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, this.form().value());
  }

  deleteApproval(approvalId: string): void {
    this.form.approvals().value.update((arr) => {
      return arr.filter((a) => a.id !== approvalId);
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, this.form().value());
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}
