import { Component, output } from "@angular/core";
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'workflow-options-menu',
  template: `
    <button 
      class="inline-flex items-center justify-center hover:bg-gray-100 w-8 h-8 rounded-full cursor-pointer transition-colors" 
      type="button" 
      [cdkMenuTriggerFor]="workflowOptions"
    >
        <span class="text-gray-500 inline-flex h-[1em]">
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
            <path fill="currentColor" d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"></path>
          </svg>
        </span>
    </button>

    <ng-template #workflowOptions>
      <ul class="bg-white shadow flex flex-col" cdkMenu>
        <li class="flex-1">
          <button class="w-full px-8 py-2 hover:bg-gray-200 text-left cursor-pointer transition-colors" cdkMenuItem (click)="editApproval.emit()">Edit Approval</button>
        </li>
        <li class="flex-1">
          <button class="w-full px-8 py-2 hover:bg-gray-200 text-left cursor-pointer transition-colors text-red-600" cdkMenuItem (click)="deleteApproval.emit()">Delete Approval</button>
        </li>
      </ul>
    </ng-template>
  `,
  imports: [CdkMenuModule]
})
export class WorkflowOptionsMenu {
  readonly editApproval = output<void>();
  readonly deleteApproval = output<void>();
}