import { Component, computed, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { RuleProperty } from '../workflow-list-rules';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dropdown-rule-property',
  template: `
    <label class="sr-only" [attr.id]="labelId()" [attr.for]="name()">Rule Property</label>

    <select 
      class="border border-gray-200 px-3 py-2 rounded-sm w-full" 
      [attr.id]="name()" 
      [name]="name()" 
      [disabled]="disabled()"  
      (change)="updateValue($event)"
      [attr.aria-describedby]="descriptionId()"
    >
      <option value=""></option>
      @for(option of options(); track option.name){
        <option [ngValue]="option" [attr.selected]="option.name == value()?.name ? true : null">{{ option.name }}</option>
      }
    </select>
    
    <small class="sr-only" [attr.id]="descriptionId()">Select a property from order type to use as basis for approval rule.</small>
  `,
  imports: [FormsModule]
})
export class DropdownRuleProperty implements FormValueControl<RuleProperty | null> {
  readonly value = model<RuleProperty | null>(null);
  readonly options = input.required<RuleProperty[]>();
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly labelId = computed(() => this.name() ? `${this.name()}-label` : '' );
  readonly descriptionId = computed(() => this.name() ? `${this.name()}-help` : '' );
  readonly valueChanged = output<void>();

  updateValue(e: Event): void {
    const el = e.target as HTMLInputElement;
    const value = el.value as string;

    this.valueChanged.emit();

    if (value == '') {
      this.value.set(null);
      return;
    }

    const obj = this.options().find(v => v.name == value);

    if (obj == undefined) {
      console.error(`Could not find matching obj for '${value}'`);
    } else {
      this.value.set(obj);
    }
  }
}
