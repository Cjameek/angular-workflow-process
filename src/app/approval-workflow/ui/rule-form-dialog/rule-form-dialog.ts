import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Control, FieldTree, form, hidden, maxLength, required } from '@angular/forms/signals';
import { DropdownRuleProperty } from '../../../shared/ui/dropdowns/dropdown-rule-property';
import { DropdownRequirementStatus } from '../../../shared/ui/dropdowns/dropdown-requirement-status';
import { GENERAL_ORDER_KEYS, GeneralOrderKeys } from '../../data-access/models/approval-workflow.model';
import { Rule } from '../../data-access/models/rule-model';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';

@Component({
  selector: 'rule-form-dialog',
  template: `
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Rule</h3>

    <p id="rules-desc" class="sr-only">Create one or more rules. Each rule contains a requirement status, a property, and a value.</p>

    <form class="flex flex-col gap-3" (submit.prevent)="saveRule()" aria-describedby="rules-desc">
      <dropdown-requirement-status [control]="ruleForm.requirementStatus" />

      <div>
        <label class="block font-medium mb-2" [attr.for]="ruleForm.description().name()">Description</label>
        <textarea 
          [control]="ruleForm.description" 
          [attr.id]="ruleForm.description().name()" 
          class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
          name="rule-description" 
          rows="2"
          [attr.aria-describedby]=" ruleForm.description().name() + '-desc'"
        ></textarea>
        <small [attr.id]=" ruleForm.description().name() + '-desc'">This will be used on the admin dashboard to describe the validation logic.</small>
      </div>
    
      <dropdown-rule-property 
        [control]="ruleForm.property" 
        [options]="values()" 
        (valueChanged)="propertyValueChanged()" 
      />

      @if(type){
        <ng-container *ngTemplateOutlet="type"></ng-container>
      }

      <button class="btn mt-3" [attr.disabled]="ruleForm().invalid() ? true : null">Save Rule</button>
    </form>

    <ng-template #type>
      @let type = ruleForm.property().value()?.type;

      @switch(type){
        @case('string') {
          <div>
            <label class="block font-medium mb-2" [attr.for]="ruleForm.value().name()">Value</label>
            <input [attr.id]="ruleForm.value().name()" [control]="ruleForm.value" type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
          </div>
        }
        @case('number') 
        {
          <div>
            <label class="block font-medium mb-2" [attr.for]="ruleForm.comparisonOperator().name()">Comparison Operator</label>
            <select 
              [attr.id]="ruleForm.comparisonOperator().name()"
              [control]="ruleForm.comparisonOperator"
              class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
              [attr.aria-describedby]="ruleForm.comparisonOperator().name() + '-desc'"
            >
              <option value="GREATER">to be greater than</option>
              <option value="EQUAL">to be equal to</option>
              <option value="LESS">to be less than</option>
            </select>
            <small [attr.id]="ruleForm.comparisonOperator().name() + '-desc'">Determine whether the rule must be greater than, less than or equal to the value.</small>
          </div>

          <div>
            <label class="block font-medium mb-2" [attr.for]="ruleForm.value().name()">Value</label>
            <input 
              [attr.id]="ruleForm.value().name()"
              [control]="ruleForm.value" 
              type="number" 
              class="border border-gray-200 px-3 py-2 rounded-sm w-full"
            >
          </div>
        }
        @case('boolean') {
          <div>
            <label class="block font-medium mb-2" [attr.for]="ruleForm.value().name()">Value</label>
            <select [attr.id]="ruleForm.value().name()" class="border border-gray-200 px-3 py-2 rounded-sm" [control]="ruleForm.value">
              <option value="TRUE">TRUE</option>
              <option value="FALSE">FALSE</option>
            </select>
          </div>
        }
      }
    </ng-template>
  `,
  imports: [Control, NgTemplateOutlet, DropdownRuleProperty, DropdownRequirementStatus],
  host: {
    'class': 'block bg-white p-6 rounded-md shadow-lg'
  }
})
export class RuleFormDialog {
  private key = Date.now().toString();
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject(DIALOG_DATA);
  
  private readonly rule = signal<Rule>(this.data.rule ?? ApprovalWorkflowUtils.createNewRule(this.key))
  readonly values = computed<GeneralOrderKeys[]>(() => this.data.values ?? GENERAL_ORDER_KEYS);

  readonly ruleForm = form(this.rule, (path) => {
    required(path.requirementStatus),
    required(path.description),
    maxLength(path.description, 50),
    required(path.property),
    required(path.value)
    hidden(path.comparisonOperator, (c) => c.valueOf(path.property)?.type != 'number')
    required(path.comparisonOperator, { when: (c) => c.valueOf(path.property)?.type == 'number' })
  });

  saveRule(): void {
    const isValid = this.ruleForm().valid();

    if(isValid){
      this.dialogRef.close(this.ruleForm().value());
    }
  }

  propertyValueChanged() {
    this.ruleForm.comparisonOperator().value.set(null);
    this.ruleForm.value().value.set(null);
  }  
}
