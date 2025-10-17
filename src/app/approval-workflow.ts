import { Component, input, linkedSignal, output } from '@angular/core';
import { applyEach, customError, FieldPath, form, hidden, maxLength, minLength, pattern, required, validate } from '@angular/forms/signals';

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

    <pre class="bg-gray-200 p-3 rounded-md">
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

  readonly form = form(this.formState, (path) => this.buildWorkflowSchema(path));

  protected cancel(): void {
    this.cancelApproval.emit();
  }

  protected save(): void {
    if(this.form().valid()){
      this.saveApproval.emit(this.form().value());
    }
  }

  private buildWorkflowSchema(path: FieldPath<ApprovalWorkflow>): void {
    minLength(path.title, 5, { message: 'Title must be at least 5 chars' }),
    maxLength(path.title, 50, { message: 'Title cannot exceed 50 chars' }),
    pattern(path.title, /^[a-zA-Z]*$/, { message: 'Only alphabetical chars allowed' }),
    validate(path.rules, (ctx) => {
        const arr = ctx.value();

        if (arr.length > 1) {
            return null;
        }

        return customError({
            kind: 'minimum_rule_requirement',
            message: `At least 1 rule required`,
        });
    }),
    validate(path.approvers, (ctx) => {
        const arr = ctx.value();

        if (arr.length > 1) {
            return null;
        }

        return customError({
            kind: 'minimum_approver_requirement',
            message: `At least 1 approver required`,
        });
    }),
    applyEach(path.rules, (ctx) => {
      required(ctx.requirementStatus),
      required(ctx.property),
      required(ctx.value)
      hidden(ctx.comparisonOperator, (c) => c.valueOf(ctx.property)?.type != 'number')
      required(ctx.comparisonOperator, { when: (c) => c.valueOf(ctx.property)?.type == 'number' })
    }),
    applyEach(path.approvers, (ctx) => {
      required(ctx.requirementStatus, { message: 'Must select a requirement status' }),
      required(ctx.user, { when: (c) => c.valueOf(ctx.type) == 'USER', message: 'A user must be selected' }),
      required(ctx.role, { when: (c) => c.valueOf(ctx.type) == 'ROLE', message: 'A role must be selected' }),
      hidden(ctx.user, (c) => c.valueOf(ctx.type) != 'USER'),
      hidden(ctx.role, (c) => c.valueOf(ctx.type) != 'ROLE')
    })
  }
}
