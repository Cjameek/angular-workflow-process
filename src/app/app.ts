import { Component, inject, linkedSignal, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ApprovalWorkflowComponent } from './approval-workflow';
import { ApprovalWorkflow } from './approval-workflow.model';

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

      @let tempApproval = stagingApproval();
      @if(!tempApproval){
        <div class="flex flex-row gap-3 items-center border-2 border-gray-200 p-5 rounded-lg">
          <p>Add a new approval</p>
          <button 
          type="button" 
          class="ml-auto bg-gray-200 border-2 border-gray-200 p-2 rounded-lg font-bold cursor-pointer hover:bg-transparent"
          (click)="stageApproval()">
            + Add Approval
          </button>
        </div>
      } @else {
        <approval-workflow 
          [isNewApproval]="true" 
          [state]="tempApproval" 
          (cancelApproval)="stagingApproval.set(null)" 
          (saveApproval)="addApproval($event)" 
        />
      }
    </main>
  `,
  imports: [ApprovalWorkflowComponent]
})
export class App {
  readonly stagingApproval = signal<ApprovalWorkflow | null>(null);

  // [TODO] simulate httpResource value 
  readonly formState = linkedSignal(() => {
    return {
      approvals: []
    };
  });

  readonly form = form<{ approvals: ApprovalWorkflow[] }>(this.formState);

  stageApproval(): void {
    this.stagingApproval.set(createNewApprovalWorkflowState());
  }

  addApproval(approval: ApprovalWorkflow): void {
    approval.id = this.convertTitleStringToId(approval.title);

    this.form.approvals().value.update((arr) => [approval, ...arr]);
    this.stagingApproval.set(null);
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
  }

  deleteApproval(approvalId: string): void {
    this.form.approvals().value.update((arr) => {
      return arr.filter((a) => a.id !== approvalId);
    });
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}
