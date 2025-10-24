import { Component, input } from '@angular/core';

@Component({
  selector: 'empty-selection-area',
  template: `
    <div class="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
      <ng-content select="[beforeTitle]" />

      <p class="text-sm text-gray-500 mb-3">{{ title() }}</p>
      
      <ng-content select="[afterTitle]" />
    </div>
  `
})
export class EmptySelectionArea {
  readonly title = input<string>('No items assigned');
}
