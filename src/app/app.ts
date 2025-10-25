import { Component } from '@angular/core';

import { ApprovalTableComponent } from './approval-workflow/feature/approval-table/approval-table';

@Component({
  selector: 'app-root',
  template: `
    <approval-table />
  `,
  imports: [ApprovalTableComponent]
})
export class App {
}
