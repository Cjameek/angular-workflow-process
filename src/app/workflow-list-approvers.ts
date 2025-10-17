import { Component, input } from "@angular/core";
import { Control, FieldTree } from "@angular/forms/signals";
import { WorkflowListItem } from "./workflow-list-item";
import { RequirementStatus } from "./approval-workflow.model";
import { DropdownRequirementStatus } from "./controls/dropdown-requirement-status";

export interface User {
  name: string,
  email: string,
  phone: string
}

export interface Approver {
  id: string,
  requirementStatus: RequirementStatus,
  user: User | null,
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
            
            <div class="flex-1">
              <input type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
            </div>
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
  imports:[Control, WorkflowListItem, DropdownRequirementStatus],
})
export class WorkflowListApprovers {
  readonly approvers = input.required<FieldTree<Approver[], string | number>>();

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
      user: null
    } as Approver
  }
}