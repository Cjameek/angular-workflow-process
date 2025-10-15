import { Approver } from "./workflow-approvers-list";
import { Rule } from "./workflow-rules-list";

export const REQUIREMENT_STATUS = ['REQUIRE', 'OPTIONAL'] as const;
export const ASSIGNMENT_CONDITION = ['OR', 'AND'] as const;
export const COMPARISON_OPERATOR = ['GREATER', 'EQUAL', 'LESS'] as const;

export type RequirementStatus = typeof REQUIREMENT_STATUS[number];
export type AssignmentCondition = typeof ASSIGNMENT_CONDITION[number];
export type ComparisonOperator = typeof COMPARISON_OPERATOR[number];

export interface NameIdPair<T, K = T> {
    id: T,
    name: K
}

export interface ApprovalWorkflow {
    id: string | null,
    title: string,
    rules: Rule[],
    approvers: Approver[],
    prevApproval: NameIdPair<string> | null,
    nextApproval: NameIdPair<string> | null,
}