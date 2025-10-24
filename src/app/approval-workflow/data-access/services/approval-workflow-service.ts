import { inject, Injectable, linkedSignal, signal } from '@angular/core';

import { LocalStorageService } from '../../../shared/data-access/services/local-storage-service';
import { ApprovalWorkflow } from '../models/approval-workflow.model';

const LOCAL_STORAGE_KEY = 'approvals';

@Injectable({
  providedIn: 'root',
})
export class ApprovalWorkflowService {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly cachedApprovals = signal<{ approvals: ApprovalWorkflow[] }>(this.localStorageService.getItem(LOCAL_STORAGE_KEY) || {
    approvals: []
  });

  private readonly _approvals = linkedSignal(() => this.cachedApprovals().approvals);
  readonly approvals = this._approvals.asReadonly();

  addApproval(approval: ApprovalWorkflow): void {
    approval.id = this.convertTitleStringToId(approval.title);

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

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}
