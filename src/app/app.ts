import { Component } from '@angular/core';

import { ApprovalRecords } from './approval-workflow/feature/approvals/approval-records';
import { ApprovalRecordsHeader } from './approval-workflow/feature/approvals-header/approvals-header';

@Component({
  selector: 'app-root',
  template: `
    <approval-records-header />
    <approval-records />
  `,
  imports: [ApprovalRecords, ApprovalRecordsHeader]
})
export class App {
}
