import { Component, computed, inject } from '@angular/core';
import { PageHeader } from '../../ui/page-header/page-header';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';

@Component({
  selector: 'approval-records-header',
  template: `
    <page-header [headingText]="'Approval Records'" [records]="records()">
      <div afterTitle>
        <button 
        type="button" 
        class="btn"
        (click)="stageApproval()"
        [attr.disabled]="stagingApproval() != null ? true : null">
          + Add Approval
        </button>
      </div>
    </page-header>
  `,
  imports: [PageHeader]
})
export class ApprovalRecordsHeader {
  private readonly workflowService = inject(ApprovalWorkflowService);

  readonly records = computed(() => this.workflowService.approvals().filter(r => r.id != null));
  readonly stagingApproval = this.workflowService.stagedApproval;

  stageApproval(): void {
    this.stagingApproval.set(ApprovalWorkflowUtils.createNewApprovalWorkflowState());
  }
}
