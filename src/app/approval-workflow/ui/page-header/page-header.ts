import { Component, input } from '@angular/core';

@Component({
  selector: 'page-header',
  template: `
    <header class="bg-white border-b border-gray-200 px-8 py-4">
      <div class="flex items-center justify-between">
        <ng-content select="[beforeTitle]" />
        
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-semibold text-gray-900">{{ headingText() }}</h1>
          <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{{ records().length }} Records</span>
        </div>

        <ng-content select="[afterTitle]" />
      </div>
    </header>
  `,
})
export class PageHeader<T> {
  readonly headingText = input.required<string>();
  readonly records = input<T[]>([]);
}
