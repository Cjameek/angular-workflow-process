import { applyEach, hidden, maxLength, minLength, pattern, required, schema } from "@angular/forms/signals";
import { ApprovalWorkflow } from "../data-access/models/approval-workflow.model";
import { Approver } from "../data-access/models/approver-model";
import { validateMinArray, validationMessageMaxLength, validationMessageRequired } from "../../shared/utils/signal-form-utils";
import { Rule } from "../data-access/models/rule-model";

export const approvalWorkflowSchema = schema<ApprovalWorkflow>((path) => {
  minLength(path.title, 5, { message: 'Title must be at least 5 chars' }),
  maxLength(path.title, 50, { message: 'Title cannot exceed 50 chars' }),
  pattern(path.title, /^[a-zA-Z ]*$/, { message: 'Only alphabetical chars allowed' }),
  validateMinArray(path.rules, 1),
  validateMinArray(path.approvers, 1),
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
});

export const approverSchema = schema<Approver>((path) => {
  required(path.requirementStatus, { message: (ctx) => validationMessageRequired(ctx) }),
  required(path.user, { when: (c) => c.valueOf(path.type) == 'USER', message: (ctx) => validationMessageRequired(ctx) }),
  required(path.role, { when: (c) => c.valueOf(path.type) == 'ROLE', message: (ctx) => validationMessageRequired(ctx) }),
  hidden(path.user, (c) => c.valueOf(path.type) != 'USER'),
  hidden(path.role, (c) => c.valueOf(path.type) != 'ROLE')
});

export const ruleSchema = schema<Rule>((path) => {
  required(path.requirementStatus, { message: (ctx) => validationMessageRequired(ctx) }),
  required(path.description, { message: (ctx) => validationMessageRequired(ctx) }),
  maxLength(path.description, 50, { message: (ctx) => validationMessageMaxLength(ctx) }),
  required(path.property, { message: (ctx) => validationMessageRequired(ctx) }),
  required(path.value, { message: (ctx) => validationMessageRequired(ctx) })
  hidden(path.comparisonOperator, (c) => c.valueOf(path.property)?.type != 'number')
  required(path.comparisonOperator, { when: (c) => c.valueOf(path.property)?.type == 'number', message: (ctx) => validationMessageRequired(ctx) })
});