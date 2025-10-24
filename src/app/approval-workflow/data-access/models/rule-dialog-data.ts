import { GeneralOrderKeys } from "./approval-workflow.model";
import { Rule } from "./rule-model";

export interface RuleDialogData {
  rule: Rule | null,
  values: GeneralOrderKeys[]
}