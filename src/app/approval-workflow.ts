import { Component, input, linkedSignal, output } from '@angular/core';
import { form, required } from '@angular/forms/signals';

import { WorkflowApproversList } from './workflow-approvers-list';
import { WorkflowRulesList } from './workflow-rules-list';
import { WorkflowTitle } from './workflow-title';
import { WorkflowOptionsMenu } from "./workflow-options-menu";
import { ApprovalWorkflow } from './approval-workflow.model';
import { WorkflowProcessingButtons } from './workflow-processing-buttons';

@Component({
  selector: 'approval-workflow',
  template: `
    <form class="flex flex-col gap-3 justify-center border-2 border-gray-200 p-5 rounded-lg">
      <ng-content select="[beforeFields]" />

      <div class="flex flex-row">
        <workflow-title [title]="form.title" [id]="form.id" />

        @if(!isNewApproval()){
          <workflow-options-menu class="block ml-auto" />
        }
      </div>

      <div class="flex flex-col gap-3">
        <workflow-rules-list [rules]="form.rules">
          <p beforeList><strong>Rules</strong></p>  
        </workflow-rules-list>
        
        <workflow-approvers-list class="block mt-3" [approvers]="form.approvers">
          <p beforeList><strong>Approvers</strong></p>  
        </workflow-approvers-list>
      </div>

      <ng-content select="[afterFields]" />

      @if(isEditing()){
        <workflow-processing-buttons 
          (onCancel)="cancel()" 
          (onSave)="save()" 
          [saveDisabled]="form().invalid()" 
        />
      }
    </form>
  `,
  imports: [WorkflowTitle, WorkflowRulesList, WorkflowApproversList, WorkflowOptionsMenu, WorkflowProcessingButtons],
})
export class ApprovalWorkflowComponent {
  readonly state = input.required<ApprovalWorkflow>();
  readonly isNewApproval = input<boolean>(false);
  readonly isEditing = linkedSignal(() => this.isNewApproval());
  readonly formState = linkedSignal(() => this.state());
  readonly cancelApproval = output<void>();
  readonly saveApproval = output<ApprovalWorkflow>();

  readonly form = form(this.formState, (path) => {
    required(path.title)
  });

  protected cancel(): void {
    this.cancelApproval.emit();
  }

  protected save(): void {
    if(this.form().valid()){
      this.saveApproval.emit(this.form().value());
    }
  }
}
