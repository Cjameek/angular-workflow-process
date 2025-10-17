import { Component, input } from '@angular/core';
import { Control, FieldTree } from '@angular/forms/signals';
import { Rule } from './workflow-list-rules';

@Component({
  selector: 'rule-input-switch',
  template: `
    @switch(type()){
      @case('string') {
        <div>
          equals
        </div>
        <div class="flex-1">
          <input [control]="rule().value" type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
        </div>
      }
      @case('number') {
        <div>
          <select class="border border-gray-200 px-3 py-2 rounded-sm w-full" [control]="rule().comparisonOperator">
            <option value="GREATER">to be greater than</option>
            <option value="EQUAL">to be equal to</option>
            <option value="LESS">to be less than</option>
          </select>
        </div>
        <div class="flex-1">
          <input 
          [control]="rule().value" 
          type="number" 
          class="border border-gray-200 px-3 py-2 rounded-sm w-full">
        </div>
      }
      @case('boolean') {
        <div>
          is
        </div>
        <div class="flex-1">
          <select class="border border-gray-200 px-3 py-2 rounded-sm" [control]="rule().value">
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </select>
        </div>
      }
    }
  `,
  imports: [Control],
  host: {
    'class': 'flex flex-row gap-3 items-center'
  }
})
export class RuleInputSwitch {
  readonly rule = input.required<FieldTree<Rule, string | number>>();
  readonly type = input.required<'string' | 'number' | 'boolean'>();
}
