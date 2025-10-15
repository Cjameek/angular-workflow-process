import { Component, input } from "@angular/core";
import { Control, FieldTree } from "@angular/forms/signals";
import { WorkflowListItem } from "./workflow-list-item";
import { RequirementStatus, AssignmentCondition, ComparisonOperator } from "./approval-workflow.model";

export interface ConditionRules {
  requirementStatus: RequirementStatus,
  assignmentCondition: AssignmentCondition | null,
  comparisonOperator: ComparisonOperator | null,
}

export interface Rule extends ConditionRules {
  id: string,
  property: any,
  value: any
}

@Component({
  selector: 'workflow-rules-list',
  template: `
    <ng-content select="[beforeList]" />
    <ul class="flex flex-col gap-2 ml-4 mt-4">
      @for(rule of rules(); track $index){
        <workflow-list-item>
          <div>
            <select [control]="rule.requirementStatus">
              <option value="REQUIRE">REQUIRE</option>
              <option value="OPTIONAL">OPTIONAL</option>
            </select>
          </div>
          <div class="flex-1">
            <input [control]="rule.value" type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
          </div>
          @if(rules()().value().length > 1){
            <span class="cursor-pointer" (click)="removeRule(rule().value())">Remove</span>
          }
        </workflow-list-item>
      }

      <workflow-list-item>
        <button type="button" class="underline cursor-pointer" (click)="addRule()">Add Another Rule</button>
      </workflow-list-item>
    </ul>
    <ng-content select="[afterList]" />
  `,
  imports: [WorkflowListItem, Control],
})
export class WorkflowRulesList {
  readonly rules = input.required<FieldTree<Rule[], string | number>>();

  addRule(): void {
    const key = Date.now().toString();

    if(this.rules()().value().length > 0){
      this.rules()().value.update((arr) => [...arr, this.createNewRule(key)]);
      return;
    }
    
    this.rules()().value.set([this.createNewRule(key)]);
  }

  removeRule(rule: Rule): void {
    const filteredArr = this.rules()().value().filter((val) => val.id != rule.id);

    this.rules()().value.set(filteredArr);
  }

  private createNewRule(id: string): Rule {
    return {
      id,
      requirementStatus: 'REQUIRE',
      assignmentCondition: null,
      comparisonOperator: null,
      value: null
    } as Rule
  }
}