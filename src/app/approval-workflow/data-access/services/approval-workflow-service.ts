import { Location } from '@angular/common';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '../../../shared/data-access/services/local-storage-service';
import { ApprovalWorkflow } from '../models/approval-workflow.model';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';

const LOCAL_STORAGE_KEY = 'approvals';

@Injectable({
  providedIn: 'root',
})
export class ApprovalWorkflowService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  private readonly cachedApprovals = signal<{ approvals: ApprovalWorkflow[] }>(this.localStorageService.getItem(LOCAL_STORAGE_KEY) || {
    approvals: []
  });

  readonly isEditing = signal<boolean>(false);

  private readonly _approvals = linkedSignal(() => this.cachedApprovals().approvals);

  readonly approvals = this._approvals.asReadonly();

  addApproval(approval: ApprovalWorkflow): void {
    if(approval.id == null){
      approval.id = ApprovalWorkflowUtils.convertTitleStringToId(approval.title);
    }

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

  routeToApprovals(): void {
    this.router.navigate(['/']);
  }

  routeToEditPage(approvalId: string): void {
    const approval = this.approvals().find((a) => a.id == approvalId);
    
    if(approval == undefined){
      throw new Error('Could not find approval to edit.');
    }

    this.router.navigate(['/edit-workflow'], { state: { workflow: approval }});
  }

  getApprovalDataFromRouteData(): ApprovalWorkflow {
    const state = this.location.getState() as { workflow?: ApprovalWorkflow, [k: string]: any };
    const approval = state?.workflow as ApprovalWorkflow | undefined;

    if(approval == undefined){
      return ApprovalWorkflowUtils.createNewApprovalWorkflowState();
    }

    return approval;
  }
}
