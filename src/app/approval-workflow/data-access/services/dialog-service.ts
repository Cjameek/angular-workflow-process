import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { filter, Observable } from 'rxjs';
import { Approver } from '../models/approver-model';
import { ApproverFormDialog } from '../../ui/approver-form-dialog/approver-form-dialog';
import { User } from '../../../shared/data-access/models/user-model';
import { Rule } from '../models/rule-model';
import { RuleFormDialog } from '../../ui/rule-form-dialog/rule-form-dialog';
import { GeneralOrderKeys } from '../models/approval-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly dialog = inject(Dialog); 

  openAddApproverDialog(approver: Approver | undefined, users: User[], roles: string[]): Observable<Approver> {
    const dialogRef = this.dialog.open<Approver>(ApproverFormDialog, {
      minWidth: '400px',
      data: {
        approver: approver !== undefined ? approver : null,
        users,
        roles
      }
    });

    return dialogRef.closed.pipe(
      filter(approver => approver != undefined && approver != null)
    );
  }

  openAddRuleDialog(rule: Rule | undefined, values: GeneralOrderKeys[]): Observable<Rule> {
    const dialogRef = this.dialog.open<Rule>(RuleFormDialog, {
      minWidth: '400px',
      data: {
        rule: rule !== undefined ? rule : null,
        values
      }
    });

    return dialogRef.closed.pipe(
      filter(rule => rule != undefined && rule != null)
    );
  }
}
