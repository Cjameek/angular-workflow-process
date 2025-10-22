import { Component, input } from '@angular/core';

@Component({
  selector: 'workflow-input-wrapper',
  template: `
    @if(displayInput()){
      <ng-content />
    } @else {
      <span>{{ text() }}</span>
    }
  `,
})
export class WorkflowInputWrapper {
  readonly text = input.required<string>();
  readonly displayInput = input<boolean>(false);
}
