import { Component, input, output, signal } from '@angular/core';
import { Control, form, hidden, required } from '@angular/forms/signals';

import { DropdownRequirementStatus } from '../../../shared/ui/dropdowns/dropdown-requirement-status';
import { DropdownRoleSelection } from '../../../shared/ui/dropdowns/dropdown-role-selection';
import { DropdownUserSelection } from '../../../shared/ui/dropdowns/dropdown-user-selection';
import { RadioGroupApproverType } from '../../../shared/ui/radio/radio-approver-type';
import { ApprovalWorkflowUtils } from '../../utils/approval-workflow-utils';
import { User } from '../../../shared/data-access/models/user-model';
import { Approver } from '../../data-access/models/approver-model';

@Component({
  selector: 'approver-form',
  template: `
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
})
export class ApproverForm {
  private key = Date.now().toString();
  readonly formData = input<Approver | null>();
  readonly users = input<User[]>([]);
  readonly roles = input<string[]>([]);
  readonly saveForm = output<Approver>();

  private readonly formState = signal<Approver>(this.formData() ?? ApprovalWorkflowUtils.createNewApprover(this.key));

  readonly approverForm = form(this.formState, (path) => {
    required(path.requirementStatus, { message: 'Must select a requirement status' }),
    required(path.user, { when: (c) => c.valueOf(path.type) == 'USER', message: 'A user must be selected' }),
    required(path.role, { when: (c) => c.valueOf(path.type) == 'ROLE', message: 'A role must be selected' }),
    hidden(path.user, (c) => c.valueOf(path.type) != 'USER'),
    hidden(path.role, (c) => c.valueOf(path.type) != 'ROLE')
  });

  saveApprover(): void {
    const isValid = this.approverForm().valid();

    if(isValid){
      this.saveForm.emit(this.approverForm().value());
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
