import { Component, input } from "@angular/core";
import { Control, FieldTree } from "@angular/forms/signals";
import { WorkflowListItem } from "./workflow-list-item";
import { RequirementStatus, ApprovalWorkflow } from "./approval-workflow.model";

export interface Approver {
  id: string,
  requirementStatus: RequirementStatus,
  user: any,
}

@Component({
  selector: 'workflow-approvers-list',
  template: `
    <ng-content select="[beforeList]" />
    <ul class="flex flex-col gap-2 ml-4 mt-4">
      @for(approver of approvers(); track $index){
        <workflow-list-item>
          <div>
            <select [control]="approver.requirementStatus">
              <option value="REQUIRE">REQUIRE</option>
              <option value="OPTIONAL">OPTIONAL</option>
            </select>
          </div>
          <div class="flex-1">
            <input type="text" class="border border-gray-200 px-3 py-2 rounded-sm w-full">
          </div>
          @if(approvers()().value().length > 1){
            <span class="cursor-pointer" (click)="removeApprover(approver().value())">Remove</span>
          }
        </workflow-list-item>
      }

      <workflow-list-item>
        <button type="button" class="underline cursor-pointer" (click)="addApprover()">Add {{ approvers()().value().length > 0 ? 'Another Approver' : 'Approver' }} </button>
      </workflow-list-item>
    </ul>
    <ng-content select="[afterList]" />
  `,
  imports:[Control, WorkflowListItem],
})
export class WorkflowApproversList {
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