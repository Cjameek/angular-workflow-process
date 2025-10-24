import { Component, inject } from '@angular/core';
import { PageHeader } from '../../ui/page-header/page-header';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';

@Component({
  selector: 'approval-records-header',
  template: `
    <page-header [headingText]="'Approval Records'" [records]="records" />
  `,
  imports: [PageHeader]
})
export class ApprovalRecordsHeader {
  private readonly workflowService = inject(ApprovalWorkflowService);

  readonly records = this.workflowService.cachedApprovals().approvals;
}
