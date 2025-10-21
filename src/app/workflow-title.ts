import { Component, input } from "@angular/core";
import { Control, FieldTree } from "@angular/forms/signals";

@Component({
  selector: 'workflow-title',
  template: `
    @if(editing()) {
      <div class="flex flex-col gap-2">
        <label class="sr-only" [attr.id]="title()().name() + '-label'" [attr.for]="title()().name()">Workflow Title</label>
        <input 
          [attr.id]="title()().name()" 
          type="text" 
          class="border border-gray-200 px-3 py-2 rounded-sm" 
          placeholder="Add title..."
          [control]="title()"
        >
        <div class="flex flex-col">
          @if(title()().errors().length > 0 && title()().touched()){
            @for(error of title()().errors(); track $index) {
              <small class="error">{{ error.message }}</small>
            }
          }
        </div>
      </div>
    } @else {
      <h2><strong>{{ title()().value() }}</strong></h2>
    }
  `,
  imports: [Control]
})
export class WorkflowTitle {
  readonly title = input.required<FieldTree<string, string | number>>();
  readonly editing = input<boolean>(false);
}