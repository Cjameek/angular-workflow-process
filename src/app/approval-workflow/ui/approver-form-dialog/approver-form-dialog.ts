import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, inject, signal } from "@angular/core";
import { ApproverDialogData } from "../../data-access/models/approver-dialog-data";
import { ApproverForm } from "../approver-form/approver-form";
import { Approver } from "../../data-access/models/approver-model";

@Component({
  selector: 'approver-form-dialog',
  template: `
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Approver</h3>

    <approver-form [formData]="approver()" [users]="users()" [roles]="roles()" (saveForm)="saveApprover($event)" />
  `,
  imports: [ApproverForm],
  host: {
    'class': 'block bg-white p-6 rounded-md shadow-lg'
  }
})
export class ApproverFormDialog {
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject<ApproverDialogData>(DIALOG_DATA);
  readonly approver = signal(this.data.approver);
  readonly users = signal(this.data.users ?? []);
  readonly roles = signal(this.data.roles ?? []);

  saveApprover(approver: Approver): void {
    this.dialogRef.close(approver);
  }
}