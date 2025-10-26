import { NameIdPair } from "../../../shared/data-access/models/name-id-pair-model";
import { Approver } from "./approver-model";
import { Rule, RuleProperty } from "./rule-model";

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

export type RequirementStatus = 'REQUIRED' | 'OPTIONAL';
export type AssignmentCondition = 'OR' | 'AND';
export type ComparisonOperator = 'GREATER' | 'EQUAL' | 'LESS';

export const REQUIREMENT_STATUS = ['REQUIRED', 'OPTIONAL'] as RequirementStatus[];
export const ASSIGNMENT_CONDITION = ['OR', 'AND'] as AssignmentCondition[];
export const COMPARISON_OPERATOR = ['GREATER', 'EQUAL', 'LESS'] as ComparisonOperator[];

export interface ApprovalWorkflow {
  id: string | null,
  title: string,
  requirementStatus: RequirementStatus,
  rules: Rule[],
  approvers: Approver[],
  prevApproval: NameIdPair<string> | null,
  nextApproval: NameIdPair<string> | null,
}