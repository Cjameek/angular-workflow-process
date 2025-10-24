import { Component, inject, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { filter } from 'rxjs';

import { RuleFormDialog } from '../../ui/rule-form-dialog/rule-form-dialog';
import { GENERAL_ORDER_KEYS } from '../../data-access/models/approval-workflow.model';
import { EmptySelectionArea } from '../../../shared/ui/empty-selection-list/empty-selection-area';
import { RulesList } from '../../ui/rules-list/rules-list';
import { Rule } from '../../data-access/models/rule-model';

@Component({
  selector: 'workflow-rules',
  template: `
    <section>
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Rules ({{ rules()().value().length }})</h3>

        @if(editing()){
          <button 
            type="button" 
            class="flex justify-center items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer" 
            (click)="openDialog()"
          >
            <span class="flex justify-center h-[10px]">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
              </svg>
            </span>
            <span>Add Rule</span>
          </button>
        }
      </div>
      
      @if(rules()().value().length > 0){
        <rules-list [rules]="rules()().value()" />
      } @else {
        <empty-selection-area [title]="'No rules defined'">
          <span beforeTitle class="flex justify-center text-gray-400 text-xl mb-2 h-[1em]">
            <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height: 1em;">
              <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
            </svg>
          </span>
          <button afterTitle type="button" class="btn secondary" (click)="openDialog()">Add Rule</button>
        </empty-selection-area>
      }
    </section>
  `,
  imports: [DialogModule, RulesList, EmptySelectionArea],
})
export class WorkflowRules {
  private readonly dialog = inject(Dialog);
  readonly rules = input.required<FieldTree<Rule[], string>>();
  readonly editing = input<boolean>(false);
  
  addRule(rule: Rule): void {
    if(this.rules()().value().length > 0){
      this.rules()().value.update((arr) => [...arr, rule]);
      return;
    }
    
    this.rules()().value.set([rule]);
  }

  removeRule(rule: Rule): void {
    const filteredArr = this.rules()().value().filter((val) => val.id != rule.id);

    this.rules()().value.set(filteredArr);
  }

  openDialog(rule?: Rule): void {
    const dialogRef = this.dialog.open<Rule>(RuleFormDialog, {
      minWidth: '400px',
      data: {
        rule: rule !== undefined ? rule : null,
        values: GENERAL_ORDER_KEYS
      }
    });

    dialogRef.closed.pipe(
      filter(rule => rule != undefined && rule != null)
    ).subscribe(rule => this.addRule(rule));
  }
}
