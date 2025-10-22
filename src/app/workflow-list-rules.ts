import { Component, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Control, FieldTree } from "@angular/forms/signals";
import { WorkflowListItem } from "./workflow-list-item";
import { RequirementStatus, AssignmentCondition, ComparisonOperator, GENERAL_ORDER_KEYS, GeneralOrderKeys } from "./approval-workflow.model";
import { DropdownRuleProperty } from "./controls/dropdown-rule-property";
import { RuleInputSwitch } from "./rule-input-switch";
import { DropdownRequirementStatus } from "./controls/dropdown-requirement-status";
import { WorkflowInputWrapper } from "./workflow-input-wrapper";
import { ValueOfPropPipe } from "./pipes/value-of-prop-pipe";

export type RuleValueType = 'string' | 'number' | 'boolean';

export interface RuleProperty {
  recordType: string,
  name: string,
  type: RuleValueType,
}

export interface ConditionRules {
  requirementStatus: RequirementStatus,
  assignmentCondition: AssignmentCondition | null,
  comparisonOperator: ComparisonOperator | null,
}

export interface Rule extends ConditionRules {
  id: string,
  property: RuleProperty | null,
  value: string | number | boolean | null
}

@Component({
  selector: 'workflow-list-rules',
  template: `
    <fieldset>
      <legend><strong>Rules</strong></legend>

      <p id="rules-desc" class="sr-only">Create one or more rules. Each rule contains a requirement status, a property, and a value.</p>

      <ul class="flex flex-col gap-2 ml-4 mt-4" aria-describedby="rules-desc">
        @for(rule of rules(); track $index){
          @let type = rule.property().value()?.type;

          <workflow-list-item>
            @if(rules()().value().length > 0 && $index != 0){
              <!-- <dropdown-assignment-condition [control]="rule.assignmentCondition" /> -->
            }
  
            <workflow-input-wrapper [displayInput]="editing()" [text]="rule.requirementStatus().value()">
              <dropdown-requirement-status [control]="rule.requirementStatus" />
            </workflow-input-wrapper>
            
            <workflow-input-wrapper [displayInput]="editing()" [text]="rule.property().value() | valueOf: 'name'">
              <dropdown-rule-property 
                [control]="rule.property" 
                [options]="values()" 
                (valueChanged)="propertyValueChanged(rule)" 
              />   
            </workflow-input-wrapper>
  
            @if(type){
              <rule-input-switch [rule]="rule" [type]="type" [editing]="editing()" />
            }
  
            @if(rules()().value().length > 1){
              <button id="removeRuleBtn" type="button" class="cursor-pointer ml-auto" (click)="removeRule(rule().value())">Remove</button>
            }
          </workflow-list-item>
        }
  
        @if(editing()){
          <workflow-list-item>
            <button id="addRuleBtn" type="button" class="underline cursor-pointer" (click)="addRule()">Add Another Rule</button>
          </workflow-list-item>
        }
      </ul>
    </fieldset>
    
  `,
  imports: [
    Control,
    ValueOfPropPipe,
    FormsModule, 
    WorkflowListItem, 
    WorkflowInputWrapper,
    DropdownRuleProperty, 
    DropdownRequirementStatus, 
    RuleInputSwitch
  ],
})
export class WorkflowListRules {
  readonly rules = input.required<FieldTree<Rule[], string | number>>();
  readonly editing = input<boolean>(false);
  readonly values = input<GeneralOrderKeys[]>(GENERAL_ORDER_KEYS);

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

  propertyValueChanged(rule: FieldTree<Rule, string | number>) {
    rule.comparisonOperator().value.set(null);
    rule.value().value.set(null);
  }

  private createNewRule(id: string): Rule {
    return {
      id,
      requirementStatus: 'REQUIRE',
      assignmentCondition: 'AND',
      comparisonOperator: null,
      property: null,
      value: null
    } as Rule
  }
}