import { Component, input, linkedSignal, output } from "@angular/core";
import { Control, FieldTree, form, maxLength, minLength, pattern, required } from "@angular/forms/signals";

@Component({
  selector: 'workflow-title-heading',
  template: `
    <h2><strong>{{ title() }} </strong>
      @if(editing()){    
        <button 
        type="button" 
        class="cursor-pointer"
        (click)="editTitle.emit()">
          (Edit)
        </button>
      }
    </h2>
  `
})
export class WorkflowTitleHeading {
  readonly title = input.required<string>();
  readonly editing = input<boolean>(false);
  readonly editTitle = output<void>();
}

@Component({
  selector: 'workflow-title-input',
  template: `
    <div class="flex flex-col gap-2">
      <label class="sr-only" [attr.id]="titleForm().name() + '-label'" [attr.for]="titleForm().name()">Workflow Title</label>
      <input 
        [attr.id]="titleForm().name()" 
        type="text" 
        class="border border-gray-200 px-3 py-2 rounded-sm" 
        placeholder="Add title..."
        [control]="titleForm"
        (keydown.escape)="closeEditing($event)"
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
  `,
  imports: [Control]
})
export class WorkflowTitleInput {
  readonly title = input.required<FieldTree<string, string | number>>();
  readonly id = input.required<FieldTree<string | null, string | number>>();
  readonly titleUpdated = output<void>();
  readonly titleFormState = linkedSignal(() => this.title()().value() || '');

  // Use inner form to apply validation on input before saving and updating main workflow form
  readonly titleForm = form(this.titleFormState, (path) => {
    required(path, { message: 'Title is required' }),
    minLength(path, 5, { message: 'Title must be at least 5 chars' }),
    maxLength(path, 50, { message: 'Title cannot exceed 50 chars' }),
    pattern(path, /^[a-zA-Z]*$/, { message: 'Only alphabetical chars allowed' })
  });

  closeEditing(e: Event): void {
    e.preventDefault();

    if (e.target == null || this.titleForm().invalid() || this.title()().value() == '') {
      return;
    }

    this.titleUpdated.emit();
  }

  updateTitle(e: Event): void {
    e.preventDefault();

    if (e.target == null || this.titleForm().invalid()) {
      return;
    }

    const el = e.target as HTMLInputElement;
    const value = el.value;

    this.title()().value.set(value);
    this.id()().value.set(this.convertTitleStringToId(value));
    this.titleUpdated.emit();
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}