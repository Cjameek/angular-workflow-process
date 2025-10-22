import { Component, computed, inject, input } from '@angular/core';
import { Control, FieldTree } from '@angular/forms/signals';
import { Rule, RuleValueType } from './workflow-list-rules';
import { WorkflowInputWrapper } from './workflow-input-wrapper';

@Component({
  selector: 'rule-input-switch',
  template: `
    @switch(type()){
      @case('string') {
        <div>
          equals
        </div>

        <workflow-input-wrapper class="flex-1" [displayInput]="editing()" [text]="stringVal()">
          <input [control]="rule().value" type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
        </workflow-input-wrapper>
      }
      @case('number') 
      {
        <workflow-input-wrapper class="flex-1" [displayInput]="editing()" [text]="rule().comparisonOperator().value() ?? ''">
          <select class="border border-gray-200 px-3 py-2 rounded-sm w-full" [control]="rule().comparisonOperator">
            <option value="GREATER">to be greater than</option>
            <option value="EQUAL">to be equal to</option>
            <option value="LESS">to be less than</option>
          </select>
        </workflow-input-wrapper>

        <workflow-input-wrapper class="flex-1" [displayInput]="editing()" [text]="stringVal()">
          <input 
            [control]="rule().value" 
            type="number" 
            class="border border-gray-200 px-3 py-2 rounded-sm w-full"
          >
        </workflow-input-wrapper>
      }
      @case('boolean') {
        <div>
          is
        </div>
        <workflow-input-wrapper class="flex-1" [displayInput]="editing()" [text]="stringVal()">
          <select class="border border-gray-200 px-3 py-2 rounded-sm" [control]="rule().value">
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </select>
        </workflow-input-wrapper>
      }
    }
  `,
  imports: [Control, WorkflowInputWrapper],
  host: {
    'class': 'flex flex-row gap-3 items-center'
  }
})
export class RuleInputSwitch {
  readonly rule = input.required<FieldTree<Rule, string | number>>();
  readonly type = input.required<RuleValueType>();
  readonly editing = input<boolean>(false);
  readonly stringVal = computed<string>(() => {
    switch(this.type()){
      case 'string':
        return (this.rule().value().value() as string) ?? '';
      case 'number':
        const num = this.rule().value().value() as number;
        return num.toString();
      case 'boolean':
        const boo = this.rule().value().value() as boolean;
        return boo == true ? 'TRUE' : 'FALSE';
      default:
        return '';
    }
  })
}
