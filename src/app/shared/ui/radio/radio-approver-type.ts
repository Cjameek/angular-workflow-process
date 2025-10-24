import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'radio-group-approver-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-2">
      <input 
        type="radio" 
        [attr.id]="name() + '-user'" 
        [name]="name()" 
        [value]="'USER'" 
        [required]="required()" 
        [disabled]="disabled()" 
        [checked]="'USER' == value()"
        (change)="updateValue($event)" 
      />
      <label [attr.id]="name() + '-userLabel'" [attr.for]="name() + '-user'">USER</label>
    </div>
    <div class="flex gap-2">
      <input 
        type="radio" 
        [attr.id]="name() + '-role'" 
        [name]="name()" 
        [value]="'ROLE'" 
        [required]="required()" 
        [disabled]="disabled()" 
        [checked]="'ROLE' == value()"
        (change)="updateValue($event)" 
      />
      <label [attr.id]="name() + '-roleLabel'" [attr.for]="name() + '-role'">ROLE</label>
    </div>
  `,
  host: {
    'class': 'flex flex-col gap-1'
  }
})
export class RadioGroupApproverType implements FormValueControl<('USER' | 'ROLE') | null> {
  readonly value = model<('USER' | 'ROLE') | null>(null);
  readonly name = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly valueChanged = output<('USER' | 'ROLE')>();

  updateValue(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as ('USER' | 'ROLE');
    
    this.value.set(value);
    this.valueChanged.emit(value);
  }
}
