import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { User } from '../workflow-list-approvers';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dropdown-user-selection',
  template: `
    <label class="sr-only" [attr.id]="labelId()" [attr.for]="name()">Select User</label>

    <select 
      class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
      [attr.id]="name()" 
      [name]="name()" 
      [disabled]="disabled()"  
      (change)="updateValue($event)"
    >
      <option value="">Select a user</option>
      @for(option of options(); track $index){
        <option [ngValue]="option.name">{{ option.name }}</option>
      }
    </select>
  `,
  imports: [FormsModule]
})
export class DropdownUserSelection implements FormValueControl<User | null> {
  readonly value = model<User | null>(null);
  readonly options = input<User[]>([]);
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelId = computed(() => this.name() ? `${this.name()}-label` : '' );

  updateValue(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;

    return this.value.set(this.options().find(opt => opt.name == value) || null);
  }
}
