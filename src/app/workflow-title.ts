import { Component, input, linkedSignal, signal } from "@angular/core";
import { Control, FieldTree, form, maxLength, minLength, pattern, required } from "@angular/forms/signals";

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
        <div class="flex flex-col gap-2">
          <label class="sr-only" [attr.id]="titleForm().name() + '-label'" [attr.for]="titleForm().name()">Workflow Title</label>
          <input 
            [attr.id]="titleForm().name()" 
            type="text" 
            class="border border-gray-200 px-3 py-2 rounded-sm" 
            placeholder="Add title..."
            [control]="titleForm"
            (keydown.escape)="editingTitle.set(false)"
            (keydown.enter)="updateTitle($event)"
          >
          <div class="flex flex-col">
            @if(titleForm().errors().length > 0 && titleForm().touched()){
              @for(error of titleForm().errors(); track $index) {
                <small class="error">{{ error.message }}</small>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  imports: [Control]
})
export class WorkflowTitle {
  readonly title = input.required<FieldTree<string, string | number>>();
  readonly id = input.required<FieldTree<string | null, string | number>>();
  readonly titleFormState = linkedSignal(() => this.title()().value() || '');

  readonly editingTitle = signal<boolean>(false);

  // Use inner form to apply validation on input before saving and updating main workflow form
  readonly titleForm = form(this.titleFormState, (path) => {
    required(path, { message: 'Title is required' }),
    minLength(path, 5, { message: 'Title must be at least 5 chars' }),
    maxLength(path, 50, { message: 'Title cannot exceed 50 chars' }),
    pattern(path, /^[a-zA-Z]*$/, { message: 'Only alphabetical chars allowed' })
  });

  updateTitle(e: Event): void {
    e.preventDefault();

    if (e.target == null || this.titleForm().invalid()) {
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