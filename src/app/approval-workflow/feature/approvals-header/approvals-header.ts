import { Component, computed, inject } from '@angular/core';

import { PageHeader } from '../../ui/page-header/page-header';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'approval-records-header',
  template: `
    <page-header [headingText]="'Approval Records'" [records]="records()">
      <div afterTitle>
        <a 
        class="btn"
       [routerLink]="['add-workflow']">
          + Add Approval
        </a>
      </div>
    </page-header>
  `,
  imports: [PageHeader, RouterLink]
})
export class ApprovalRecordsHeader {
  private readonly workflowService = inject(ApprovalWorkflowService);

  readonly records = computed(() => this.workflowService.approvals().filter(r => r.id != null));
}
