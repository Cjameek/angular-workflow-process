import { Component, input } from '@angular/core';

@Component({
  selector: 'generic-badge',
  template: `
    <div class="inline-flex justify-center items-center bg-gray-200 text-gray-400 w-10 h-10 rounded-full border-2 border-gray-200">
      <ng-content />
    </div>
  `,
  imports: [],
})
export class GenericBadge {
}
