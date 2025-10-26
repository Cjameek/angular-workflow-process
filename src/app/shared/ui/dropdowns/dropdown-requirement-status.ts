import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { REQUIREMENT_STATUS, RequirementStatus } from '../../../approval-workflow/data-access/models/approval-workflow.model';

@Component({
  selector: 'dropdown-requirement-status',
  template: `
    <label class="block font-medium mb-2" [attr.id]="labelId()" [attr.for]="name()">Requirement Status</label>

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
    
    <small class="sr-only" [attr.id]="descriptionId()">Assign whether the associated condition is required or optional.</small>
  `
})
export class DropdownRequirementStatus implements FormValueControl<RequirementStatus> {
  readonly value = model<RequirementStatus>('REQUIRED');
  readonly options = input<RequirementStatus[]>(REQUIREMENT_STATUS);
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelId = computed(() => this.name() ? `${this.name()}-label` : '' );
  readonly descriptionId = computed(() => this.name() ? `${this.name()}-help` : '' );

  updateValue(e: Event): void {
    const el = e.target as HTMLInputElement;
    const value = el.value as RequirementStatus;

    this.value.set(value)
  }
}
