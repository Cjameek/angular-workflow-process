import { Approver } from "./workflow-list-approvers";
import { Rule, RuleProperty } from "./workflow-list-rules";

export enum OrderType {
  GENERAL_ORDER = 1,
  SPECIAL_ORDER = 2
}

interface GeneralOrder {
  partNo: string,
  specialPart: boolean,
  totalPrice: number
}

export type GeneralOrderKeys = {
  [K in keyof Omit<RuleProperty, 'name'>]: RuleProperty[K]
} & { name: keyof GeneralOrder & {} };

export const GENERAL_ORDER_KEYS: GeneralOrderKeys[] = [
  {
    recordType: 'order',
    name: 'specialPart',
    type: 'boolean'
  },
  {
    recordType: 'order',
    name: 'partNo',
    type: 'string'
  },
  {
    recordType: 'order',
    name: 'totalPrice',
    type: 'number'
  },
];

export const REQUIREMENT_STATUS = ['REQUIRE', 'OPTIONAL'];
export const ASSIGNMENT_CONDITION = ['OR', 'AND'];
export const COMPARISON_OPERATOR = ['GREATER', 'EQUAL', 'LESS'];

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