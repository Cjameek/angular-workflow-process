import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'dropdown-role-selection',
  template: `
    <label class="block font-medium mb-2" [attr.id]="labelId()" [attr.for]="name()">Select User Role</label>

    <select 
      class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
      [attr.id]="name()" 
      [name]="name()" 
      [disabled]="disabled()"  
      (change)="updateValue($event)"
    >
      <option value="">Select a role</option>
      @for(option of options(); track $index){
        <option [value]="option" [attr.selected]="option == value() ? true : null">Any {{ option | lowercase | titlecase }}</option>
      }
    </select>
  `,
  imports: [LowerCasePipe, TitleCasePipe]
})
export class DropdownRoleSelection implements FormValueControl<string | null> {
  readonly value = model<string | null>(null);
  readonly options = input<string[]>([]);
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelId = computed(() => this.name() ? `${this.name()}-label` : '' );

  updateValue(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this.value.set(value);
  }
}
