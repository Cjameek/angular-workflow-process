import { Component, input, linkedSignal, output } from '@angular/core';
import { applyEach, Control, customError, FieldPath, form, hidden, maxLength, minLength, pattern, required, validate } from '@angular/forms/signals';

import { ApprovalWorkflow } from '../../data-access/models/approval-workflow.model';
import { WorkflowApprovers } from '../../feature/approvers/workflow-approvers';
import { WorkflowRules } from '../../feature/rules/workflow-rules';

@Component({
  selector: 'add-workflow-form',
  template: `
    <form class="flex flex-col gap-3 justify-center p-6" (ngSubmit)="save()">
      <div class="flex flex-col gap-2">
        <label class="block font-medium mb-2" [attr.id]="form.title().name() + '-label'" [attr.for]="form.title().name()">Workflow Title</label>
        <input 
          [attr.id]="form.title().name()" 
          type="text" 
          class="border border-gray-200 px-3 py-2 rounded-sm"
          [control]="form.title"
          aria-describedby="workflow-title-desc"
        >
        <small id="workflow-title-desc">The title will be used to generate a unique id.</small>
        <div class="flex flex-col">
          @if(form.title().errors().length > 0 && form.title().touched()){
            @for(error of form.title().errors(); track $index) {
              <small class="error">{{ error.message }}</small>
            }
          }
        </div>
      </div>

      <fieldset>
        <legend class="block font-medium mb-2">Requirement Status</legend>
        <div class="flex gap-2">
          <input 
            type="radio" 
            [control]="form.requirementStatus"
            id="requirementStatus-required" 
            name="requirementStatus" 
            [value]="'REQUIRED'"
          />
          <label for="requirementStatus-required">REQUIRED</label>
        </div>
        <div class="flex gap-2">
          <input 
            type="radio"
            [control]="form.requirementStatus"
            id="requirementStatus-optional" 
            name="requirementStatus" 
            [value]="'OPTIONAL'"
          />
          <label for="requirementStatus-optional">OPTIONAL</label>
        </div>
      </fieldset>

      <div class="flex flex-col gap-3">
        <workflow-rules [rules]="form.rules" />
        <workflow-approvers [approvers]="form.approvers" />
      </div>

      <div class="flex flex-row justify-end gap-3">
        <button 
          id="cancelApprovalBtn"
          type="button" 
          class="btn secondary" 
          (click)="cancelApproval.emit()"
        >
          Cancel
        </button>
        <button 
          id="submitApprovalBtn"
          class="btn" 
          [attr.disabled]="form().invalid() ? true : null"
          (click.prevent)="save()"
        >
          Save
        </button>
      </div>
    </form>
  `,
  imports: [
    Control,
    WorkflowRules,
    WorkflowApprovers
  ],
  host: {
    'class': 'block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
  }
})
export class AddWorkflowForm {
  readonly state = input.required<ApprovalWorkflow>();
  readonly formState = linkedSignal(() => this.state());
  readonly cancelApproval = output<void>();
  readonly saveApproval = output<ApprovalWorkflow>();

  readonly form = form(this.formState, (path) => this.buildWorkflowSchema(path));

  protected cancel(): void {
    // [TODO] Should be checking dirty status instead of touched, but it doesn't appear to be working
    if(this.form().touched()){
      const w = window.confirm('Do you want to undo these changes?');
  
      if(!w) return;
    }

    this.cancelApproval.emit();
  }

  protected save(): void {
    const isValid = this.form().valid();
    const errors = this.form().errors();

    if(isValid){
      this.saveApproval.emit(this.form().value());
    }
  }

  private buildWorkflowSchema(path: FieldPath<ApprovalWorkflow>): void {
    required(path.requirementStatus),
    minLength(path.title, 5, { message: 'Title must be at least 5 chars' }),
    maxLength(path.title, 50, { message: 'Title cannot exceed 50 chars' }),
    pattern(path.title, /^[a-zA-Z ]*$/, { message: 'Only alphabetical chars allowed' }),
    validate(path.rules, (ctx) => {
        const arr = ctx.value();

        if (arr.length >= 1) {
            return null;
        }

        return customError({
            kind: 'minimum_rule_requirement',
            message: `At least 1 rule required`,
        });
    }),
    validate(path.approvers, (ctx) => {
        const arr = ctx.value();

        if (arr.length >= 1) {
            return null;
        }

        return customError({
            kind: 'minimum_approver_requirement',
            message: `At least 1 approver required`,
        });
    }),
    applyEach(path.rules, (ctx) => {
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
