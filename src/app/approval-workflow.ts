import { Component, input, linkedSignal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { WorkflowApproversList } from './workflow-approvers-list';
import { WorkflowRulesList } from './workflow-rules-list';
import { WorkflowTitle } from './workflow-title';
import { WorkflowOptionsMenu } from "./workflow-options-menu";
import { ApprovalWorkflow } from './approval-workflow.model';
import { createNewApprovalWorkflowState } from './app';

@Component({
  selector: 'approval-workflow',
  template: `
    <form class="flex flex-col gap-3 justify-center border-2 border-amber-500 p-5 rounded-lg">
      <div class="flex flex-row">
        <workflow-title [form]="form" />
        <workflow-options-menu class="block ml-auto" />
      </div>

      <div class="flex flex-col gap-3">
        <workflow-rules-list [form]="form">
          <p beforeList><strong>Rules</strong></p>  
        </workflow-rules-list>
        
        <workflow-approvers-list class="block mt-3" [form]="form">
          <p beforeList><strong>Approvers</strong></p>  
        </workflow-approvers-list>
      </div>

      <footer class="flex flex-row justify-end gap-3">
        <button type="button" class="px-3 py-2 bg-amber-500 font-bold rounded-sm cursor-pointer">Cancel</button>
        <button type="button" class="px-3 py-2 bg-amber-500 font-bold rounded-sm cursor-pointer">Save</button>
      </footer>
    </form>
  `,
  imports: [WorkflowTitle, WorkflowRulesList, WorkflowApproversList, WorkflowOptionsMenu],
})
export class ApprovalWorkflowComponent {
  readonly state = input<ApprovalWorkflow>();
  readonly formState = linkedSignal(() => this.state() ?? createNewApprovalWorkflowState());

  readonly form = form<ApprovalWorkflow>(this.formState, (path) => {
    required(path.title, { message: 'Title is required' })
  });
}
