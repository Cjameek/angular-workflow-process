import { Component, input, linkedSignal, output } from '@angular/core';
import { applyEach, form, required } from '@angular/forms/signals';

import { WorkflowListApprovers } from './workflow-list-approvers';
import { WorkflowListRules } from './workflow-list-rules';
import { WorkflowTitle } from './workflow-title';
import { WorkflowOptionsMenu } from "./workflow-options-menu";
import { ApprovalWorkflow } from './approval-workflow.model';
import { WorkflowProcessingButtons } from './workflow-processing-buttons';
import { CommonModule } from '@angular/common';

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
        <workflow-list-rules [rules]="form.rules" />
        <workflow-list-approvers [approvers]="form.approvers" />
      </div>

      <ng-content select="[afterFields]" />

      @if(isEditing()){
        <workflow-processing-buttons 
          (onCancel)="cancel()" 
          (onSave)="save()"
        />
      }
    </form>

    <pre>
      {{ form().value() | json }}
    </pre>
  `,
  imports: [CommonModule, WorkflowTitle, WorkflowListRules, WorkflowListApprovers, WorkflowOptionsMenu, WorkflowProcessingButtons],
})
export class ApprovalWorkflowComponent {
  readonly state = input.required<ApprovalWorkflow>();
  readonly isNewApproval = input<boolean>(false);
  readonly isEditing = linkedSignal(() => this.isNewApproval());
  readonly formState = linkedSignal(() => this.state());
  readonly cancelApproval = output<void>();
  readonly saveApproval = output<ApprovalWorkflow>();

  readonly form = form(this.formState, (path) => {
    required(path.title),
    applyEach(path.rules, (ctx) => {
      required(ctx.requirementStatus),
      required(ctx.property),
      required(ctx.value)
      // required(ctx.comparisonOperator, { when: () => ctx.property })
    })
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
