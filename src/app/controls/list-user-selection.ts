import { NgTemplateOutlet } from '@angular/common';
import { Component, input, model, TemplateRef } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {CdkListboxModule, ListboxValueChangeEvent} from '@angular/cdk/listbox';
import { User } from '../workflow-list-approvers';

@Component({
  selector: 'list-user-selection',
  template: `
    <ul 
      cdkListbox
      cdkListboxMultiple
      cdkListboxUseActiveDescendant
      [cdkListboxValue]="value()"
      (cdkListboxValueChange)="updateValue($event)"
    >
      @for(option of options(); track $index) {
        <li [cdkOption]="option" class="example-option">
          @if(templateRef()){
            <ng-container *ngTemplateOutlet="templateRef(); context: { $implicit: option }"></ng-container>
          } @else {
            {{ option.name }}
          }
        </li>
      }
    </ul>
  `,
  imports: [CdkListboxModule, NgTemplateOutlet],
})
export class ListUserSelection implements FormValueControl<User[]> {
  readonly value = model<User[]>([]);
  readonly options = input.required<User[]>();
  readonly templateRef = input<TemplateRef<unknown>>();

  updateValue(e: ListboxValueChangeEvent<User>) {
    const value = [...e.value];
    this.value.set(value);
  }
}
