import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { ASSIGNMENT_CONDITION, AssignmentCondition } from '../approval-workflow.model';

@Component({
  selector: 'dropdown-assignment-condition',
  template: `
    <label class="sr-only" [attr.id]="labelId()" [attr.for]="name()">Assignment Condition</label>

    <select 
      class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
      [attr.id]="name()" 
      [name]="name()" 
      [disabled]="disabled()"  
      (change)="updateValue($event)"
      [attr.aria-describedby]="descriptionId()"
    >
      @for(option of options(); track option){
        <option [value]="option" [attr.selected]="option == value() ? true : null">{{ option }}</option>
      }
    </select>
    
    <small class="sr-only" [attr.id]="descriptionId()">Assign whether this rule condition is AND or OR.</small>
  `
})
export class DropdownAssignmentCondition implements FormValueControl<AssignmentCondition> {
  readonly value = model<AssignmentCondition>('AND');
  readonly options = input<AssignmentCondition[]>(ASSIGNMENT_CONDITION);
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelId = computed(() => this.name() ? `${this.name()}-label` : '' );
  readonly descriptionId = computed(() => this.name() ? `${this.name()}-help` : '' );

  updateValue(e: Event): void {
    const el = e.target as HTMLInputElement;
    const value = el.value as AssignmentCondition;

    this.value.set(value)
  }
}
