import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, inject, signal } from "@angular/core";
import { Control, form, hidden, required } from "@angular/forms/signals";
import { RadioGroupApproverType } from "../../../shared/ui/radio/radio-approver-type";
import { DropdownRequirementStatus } from "../../../shared/ui/dropdowns/dropdown-requirement-status";
import { DropdownUserSelection } from "../../../shared/ui/dropdowns/dropdown-user-selection";
import { DropdownRoleSelection } from "../../../shared/ui/dropdowns/dropdown-role-selection";
import { ApproverDialogData } from "../../data-access/models/approver-dialog-data";
import { ApprovalWorkflowUtils } from "../../utils/approval-workflow-utils";

@Component({
  selector: 'approver-form-dialog',
  template: `
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Approver</h3>

    <p id="approvers-desc" class="sr-only">Add approvers and whether they are required.</p>

    <form class="flex flex-col gap-3" (submit.prevent)="saveApprover()" aria-describedby="approvers-desc">
      <dropdown-requirement-status [control]="approverForm.requirementStatus" />
      
      <fieldset>
        <legend class="block font-medium mb-2">Select the type of approver</legend>
        <radio-group-approver-type 
          [control]="approverForm.type" 
          (valueChanged)="approverTypeChanged($event)" 
        />
      </fieldset>
      
      @if(!approverForm.user().hidden()){
        <dropdown-user-selection [options]="users()" [control]="approverForm.user" />
      }
      
      @if(!approverForm.role().hidden()){
        <dropdown-role-selection [options]="roles()" [control]="approverForm.role" />
      }

      <button class="btn mt-3" [attr.disabled]="approverForm().invalid() ? true : null">Save Approver</button>
    </form>
  `,
  imports: [Control, DropdownRequirementStatus, DropdownUserSelection, DropdownRoleSelection, RadioGroupApproverType],
  host: {
    'class': 'block bg-white p-6 rounded-md shadow-lg'
  }
})
export class ApproverFormDialog {
  private key = Date.now().toString();
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject<ApproverDialogData>(DIALOG_DATA);
  private readonly approver = signal(this.data.approver ?? ApprovalWorkflowUtils.createNewApprover(this.key));
  readonly users = signal(this.data.users ?? []);
  readonly roles = signal(this.data.roles ?? []);

  readonly approverForm = form(this.approver, (path) => {
    required(path.requirementStatus, { message: 'Must select a requirement status' }),
    required(path.user, { when: (c) => c.valueOf(path.type) == 'USER', message: 'A user must be selected' }),
    required(path.role, { when: (c) => c.valueOf(path.type) == 'ROLE', message: 'A role must be selected' }),
    hidden(path.user, (c) => c.valueOf(path.type) != 'USER'),
    hidden(path.role, (c) => c.valueOf(path.type) != 'ROLE')
  });

  saveApprover(): void {
    const isValid = this.approverForm().valid();

    if(isValid){
      this.dialogRef.close(this.approverForm().value());
    }
  }

  approverTypeChanged(value: ('USER' | 'ROLE')): void {
    if(value == 'USER'){
      this.approverForm.role().value.set(null);
    }
    if(value == 'ROLE'){
      this.approverForm.user().value.set(null);
    }
  }
}