import { RequirementStatus, AssignmentCondition, ComparisonOperator } from "./approval-workflow.model";

export type RuleValueType = 'string' | 'number' | 'boolean';

export interface RuleProperty {
  recordType: string,
  name: string,
  type: RuleValueType,
}

export interface ConditionRules {
  assignmentCondition: AssignmentCondition | null,
  comparisonOperator: ComparisonOperator | null,
}

export interface Rule extends ConditionRules {
  id: string,
  description: string,
  property: RuleProperty | null,
  value: string | number | boolean | null
}