import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { GENERAL_ORDER_KEYS, GeneralOrderKeys } from '../../data-access/models/approval-workflow.model';
import { Rule } from '../../data-access/models/rule-model';
import { RuleForm } from '../rule-form/rule-form';

@Component({
  selector: 'rule-form-dialog',
  template: `
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Rule</h3>

    <rule-form [formData]="rule()" [values]="values()" (saveForm)="saveRule($event)"/>
  `,
  imports: [RuleForm],
  host: {
    'class': 'block bg-white p-6 rounded-md shadow-lg'
  }
})
export class RuleFormDialog {
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject(DIALOG_DATA);
  
  readonly rule = signal<Rule>(this.data.rule)
  readonly values = signal<GeneralOrderKeys[]>(this.data.values ?? GENERAL_ORDER_KEYS);

  saveRule(value: Rule): void {
    this.dialogRef.close(value);
  }
}
