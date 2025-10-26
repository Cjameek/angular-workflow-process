import { NgTemplateOutlet } from "@angular/common";
import { Component, input, output, signal } from "@angular/core";
import { Control, form, required, maxLength, hidden } from "@angular/forms/signals";
import { DropdownRequirementStatus } from "../../../shared/ui/dropdowns/dropdown-requirement-status";
import { DropdownRuleProperty } from "../../../shared/ui/dropdowns/dropdown-rule-property";
import { GeneralOrderKeys } from "../../data-access/models/approval-workflow.model";
import { Rule } from "../../data-access/models/rule-model";
import { ApprovalWorkflowUtils } from "../../utils/approval-workflow-utils";

@Component({
  selector: 'rule-form',
  template: `
    <p id="rules-desc" class="sr-only">Create one or more rules. Each rule contains a requirement status, a property, and a value.</p>

    <form class="flex flex-col gap-3" (submit.prevent)="saveRule()" aria-describedby="rules-desc">
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
})
export class RuleForm {
  private key = Date.now().toString();
  readonly formData = input<Rule | null>();
  readonly values = input<GeneralOrderKeys[]>([]);
  readonly saveForm = output<Rule>();
  
  private readonly formState = signal<Rule>(this.formData() ?? ApprovalWorkflowUtils.createNewRule(this.key));

  readonly ruleForm = form(this.formState, (path) => {
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
      this.saveForm.emit(this.ruleForm().value());
    }
  }

  propertyValueChanged() {
    this.ruleForm.comparisonOperator().value.set(null);
    this.ruleForm.value().value.set(null);
  }  
}