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
          @if(editing()){
            <input [control]="rule().value" type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
          } @else {
            <span>{{ rule().value().value() }}</span>
          }
        </div>
      }
      @case('number') {
        <div>
          @if(editing()){
            <select class="border border-gray-200 px-3 py-2 rounded-sm w-full" [control]="rule().comparisonOperator">
              <option value="GREATER">to be greater than</option>
              <option value="EQUAL">to be equal to</option>
              <option value="LESS">to be less than</option>
            </select>
          } @else {
            <span>{{ rule().comparisonOperator().value() }}</span>
          }
        </div>
        <div class="flex-1">
          @if(editing()){
            <input 
              [control]="rule().value" 
              type="number" 
              class="border border-gray-200 px-3 py-2 rounded-sm w-full"
            >
          } @else {
            <span>{{ rule().value().value() }}</span>
          }
        </div>
      }
      @case('boolean') {
        <div>
          is
        </div>
        <div class="flex-1">
          @if(editing()){
            <select class="border border-gray-200 px-3 py-2 rounded-sm" [control]="rule().value">
              <option value="TRUE">TRUE</option>
              <option value="FALSE">FALSE</option>
            </select>
          } @else {
            <span>{{ rule().value().value() }}</span>
          }
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
  readonly editing = input<boolean>(false);
}
