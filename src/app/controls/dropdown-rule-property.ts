import { Component, computed, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { RuleProperty } from '../workflow-list-rules';

type NarrowedRuleProperty<T> = {
  [K in keyof Omit<RuleProperty, 'name'>]: RuleProperty[K]
} & { name: keyof T };

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
      @for(key of keys(); track key){
        <option [value]="key">{{ key }}</option>
      }
    </select>
    
    <small class="sr-only" [attr.id]="descriptionId()">Select a property from order type to use as basis for approval rule.</small>
  `
})
export class DropdownRuleProperty<T> implements FormValueControl<NarrowedRuleProperty<T> | null> {
  readonly value = model<NarrowedRuleProperty<T> | null>(null);
  readonly options = input.required<NarrowedRuleProperty<T>[]>();
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly keys = computed(() => this.options().map(v => v.name));
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
