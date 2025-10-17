import { Component, input, signal } from "@angular/core";
import { FieldTree } from "@angular/forms/signals";

@Component({
  selector: 'workflow-title',
  template: `
    <div class="flex flex-col gap-2">
      @if(!editingTitle() && title()().value()){
        <h2><strong>{{ title()().value() }} </strong>
          <button 
          type="button" 
          class="cursor-pointer"
          (click)="editingTitle.set(true)">
            (Edit)
          </button>
        </h2>
      }
      
      @if(editingTitle() || title()().value() == ''){
        <div class="flex flex-row gap-2">
          <label class="sr-only" [attr.id]="title()().name() + '-label'" [attr.for]="title()().name()">Workflow Title</label>
          <input 
            [attr.id]="title()().name()" 
            type="text" 
            class="border border-gray-200 px-3 py-2 rounded-sm" 
            [value]="title()().value()"
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
  readonly title = input.required<FieldTree<string, string | number>>();
  readonly id = input.required<FieldTree<string | null, string | number>>();

  readonly editingTitle = signal<boolean>(false);

  updateTitle(e: Event): void {
    e.preventDefault();

    if (e.target == null) {
      return;
    }

    const el = e.target as HTMLInputElement;
    const value = el.value;

    this.editingTitle.set(false);
    this.title()().value.set(value);
    this.id()().value.set(this.convertTitleStringToId(value));
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}