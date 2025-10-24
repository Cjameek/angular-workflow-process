import { inject, Injectable, linkedSignal, signal } from '@angular/core';

import { LocalStorageService } from '../../../shared/data-access/services/local-storage-service';
import { ApprovalWorkflow } from '../models/approval-workflow.model';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';

const LOCAL_STORAGE_KEY = 'approvals';

@Injectable({
  providedIn: 'root',
})
export class ApprovalWorkflowService {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly cachedApprovals = signal<{ approvals: ApprovalWorkflow[] }>(this.localStorageService.getItem(LOCAL_STORAGE_KEY) || {
    approvals: []
  });

  readonly isEditing = signal<boolean>(false);
  readonly stagedApproval = signal<ApprovalWorkflow | null>(null);

  private readonly _approvals = linkedSignal(() => {
    const approvals = this.cachedApprovals().approvals;
    const stagedApproval = this.stagedApproval();

    if(stagedApproval !== null){
      return [stagedApproval, ...approvals];
    }

    return approvals;
  });

  readonly approvals = this._approvals.asReadonly();

  addApproval(approval: ApprovalWorkflow): void {
    if(approval.id == null){
      approval.id = ApprovalWorkflowUtils.convertTitleStringToId(approval.title);
    }

    this.stagedApproval.set(null);

    this._approvals.update((arr) => [approval, ...arr]);

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, { approvals: this.approvals() });
  }

  updateApproval(approval: ApprovalWorkflow): void {
    this._approvals.update((arr) => {
      return arr.map((a) => {
        if (a.id == approval.id) {
          return approval;
        }

        return a;
      });
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, { approvals: this.approvals() });
  }

  deleteApproval(approvalId: string): void {
    this._approvals.update((arr) => {
      return arr.filter((a) => a.id !== approvalId);
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, { approvals: this.approvals() });
  }
}
