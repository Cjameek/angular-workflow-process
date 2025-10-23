import { inject, Injectable, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

import { LocalStorageService } from './services/local-storage-service';
import { ApprovalWorkflow } from './approval-workflow.model';

const LOCAL_STORAGE_KEY = 'approvals';

@Injectable({
  providedIn: 'root'
})
export class ApprovalWorkflowService {
  private readonly localStorageService = inject(LocalStorageService);

  readonly cachedApprovals = signal<{ approvals: ApprovalWorkflow[] }>(this.localStorageService.getItem(LOCAL_STORAGE_KEY) || {
    approvals: []
  });

  addApproval(approval: ApprovalWorkflow, signalForm: FieldTree<{
    approvals: ApprovalWorkflow[];
  }, string | number>): void {
    approval.id = this.convertTitleStringToId(approval.title);

    signalForm.approvals().value.update((arr) => [approval, ...arr]);

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, signalForm().value());
  }

  updateApproval(approval: ApprovalWorkflow, signalForm: FieldTree<{
    approvals: ApprovalWorkflow[];
  }, string | number>): void {
    signalForm.approvals().value.update((arr) => {
      return arr.map((a) => {
        if (a.id == approval.id) {
          return approval;
        }

        return a;
      });
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, signalForm().value());
  }

  deleteApproval(approvalId: string, signalForm: FieldTree<{
    approvals: ApprovalWorkflow[];
  }, string | number>): void {
    signalForm.approvals().value.update((arr) => {
      return arr.filter((a) => a.id !== approvalId);
    });

    this.localStorageService.setItem<{ approvals: ApprovalWorkflow[] }>(LOCAL_STORAGE_KEY, signalForm().value());
  }

  private convertTitleStringToId(title: string): string {
    return title.replace(' ', '_').toUpperCase();
  }
}
