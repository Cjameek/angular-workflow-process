import { Component, input, signal } from "@angular/core";
import { FieldTree } from "@angular/forms/signals";
import { ApprovalWorkflow } from "./approval-workflow.model";

@Component({
  selector: 'workflow-title',
  template: `
    <div class="flex flex-col gap-2">
      @if(!editingTitle() && form().title().value()){
        <h2><strong>{{ form().title().value() }} </strong>
          <button 
          type="button" 
          class="cursor-pointer"
          (click)="editingTitle.set(true)">
            (Edit)
          </button>
        </h2>
      }
      
      @if(editingTitle() || form().title().value() == ''){
        <div class="flex flex-row gap-2">
          <input 
            id="title" 
            type="text" 
            class="border border-amber-500 px-3 py-2 rounded-sm" 
            [value]="form().title().value()"
            placeholder="Add title..."
            (keydown.escape)="editingTitle.set(false)"
            (keydown.enter)="updateTitle($event)"
          >
        </div>
      }
    </div>
  `,
})
export class WorkflowTitle {
  readonly form = input.required<FieldTree<ApprovalWorkflow, string | number>>();

  readonly editingTitle = signal<boolean>(false);

  updateTitle(e: Event): void {
    e.preventDefault();

    if (e.target == null) {
      return;
    }

    const el = e.target as HTMLInputElement;
    const value = el.value;

    this.editingTitle.set(false);
    this.form().title().value.set(value);
    this.form().id().value.set(this.convertTitleStringToId(value));
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}