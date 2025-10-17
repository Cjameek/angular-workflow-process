import { Component, input } from "@angular/core";
import { Control, FieldTree } from "@angular/forms/signals";
import { WorkflowListItem } from "./workflow-list-item";
import { RequirementStatus } from "./approval-workflow.model";
import { DropdownRequirementStatus } from "./controls/dropdown-requirement-status";
import { DropdownUserSelection } from "./controls/dropdown-user-selection";
import { DropdownRoleSelection } from "./controls/dropdown-role-selection";

export interface User {
  name: string,
  email: string,
  phone: string
}

export interface Approver {
  id: string,
  requirementStatus: RequirementStatus,
  type: 'USER' | 'ROLE',
  user: User | null,
  role: string | null
}

@Component({
  selector: 'workflow-list-approvers',
  template: `
    <fieldset>
      <legend><strong>Approvers</strong></legend>

      <p id="approvers-desc" class="sr-only">Add approvers and whether they are required.</p>

      <ul class="flex flex-col gap-2 ml-4 mt-4" aria-describedby="approvers-desc">
        @for(approver of approvers(); track $index){
          <workflow-list-item>
            <dropdown-requirement-status [control]="approver.requirementStatus" />

            <div class="flex flex-col">
              <label>
                <input type="radio" [control]="approver.type" [value]="'USER'" />
                User
              </label>
              <label>
                <input type="radio" [control]="approver.type" [value]="'ROLE'" />
                Role
              </label>
            </div>
            
            @if(!approver.user().hidden()){
              <dropdown-user-selection class="block flex-1" [options]="users()" [control]="approver.user" />
            }

            @if(!approver.role().hidden()){
              <dropdown-role-selection class="block flex-1" [options]="roles()" [control]="approver.role" />
            }

            @if(approvers()().value().length > 1){
              <span id="removeApproverBtn" class="cursor-pointer" (click)="removeApprover(approver().value())">Remove</span>
            }
          </workflow-list-item>
        }
  
        <workflow-list-item>
          <button 
            id="addWorkflowBtn" 
            type="button" 
            class="underline cursor-pointer" 
            (click)="addApprover()"
          >
            Add {{ approvers()().value().length > 0 ? 'Another Approver' : 'Approver' }} 
          </button>
        </workflow-list-item>
      </ul>
    </fieldset>
  `,
  imports:[Control, WorkflowListItem, DropdownRequirementStatus, DropdownUserSelection, DropdownRoleSelection],
})
export class WorkflowListApprovers {
  readonly approvers = input.required<FieldTree<Approver[], string | number>>();
  readonly users = input<User[]>([
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-0101' },
    { name: 'Bob Martinez', email: 'bob.martinez@example.com', phone: '555-0102' },
    { name: 'Charlie Kim', email: 'charlie.kim@example.com', phone: '555-0103' },
    { name: 'Dana Lee', email: 'dana.lee@example.com', phone: '555-0104' }
  ]);
  readonly roles = input<string[]>(['ADMIN','REVIEWER','SUBMITTER','PLANNER','ENGINEER']);

  addApprover(): void {
    const key = Date.now().toString();

    if(this.approvers()().value().length > 0){
      this.approvers()().value.update((arr) => [...arr, this.createNewApprover(key)]);
      return;
    }
    
    this.approvers()().value.set([this.createNewApprover(key)]);
  }

  removeApprover(approver: Approver): void {
    const filteredArr = this.approvers()().value().filter((val) => val.id != approver.id);

    this.approvers()().value.set(filteredArr);
  }

  private createNewApprover(id: string): Approver {
    return {
      id,
      requirementStatus: 'REQUIRE',
      type: 'USER',
      user: null,
      role: null
    } as Approver
  }
}