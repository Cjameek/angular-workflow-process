import { Component, input } from '@angular/core';

@Component({
  selector: 'role-list',
  template: `
    @for(role of roles(); track $index) {
      <div class="flex items-center bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
        <span class="text-sm font-medium text-purple-700">{{ role }}</span>
      </div>
    }
  `,
  host: {
    'class': 'flex flex-wrap gap-2'
  }
})
export class RoleList {
  readonly roles = input.required<string[]>();
}
