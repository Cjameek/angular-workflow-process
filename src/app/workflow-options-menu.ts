import { Component } from "@angular/core";
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'workflow-options-menu',
  template: `
    <button 
      class="inline-flex items-center justify-center bg-gray-200 w-8 h-8 rounded-full cursor-pointer" 
      type="button" 
      [cdkMenuTriggerFor]="workflowOptions"
    >
        <span>...</span>
    </button>

    <ng-template #workflowOptions>
      <ul class="bg-white shadow flex flex-col" cdkMenu>
        <li class="flex-1">
          <button class="w-full px-8 py-2 hover:bg-gray-200 text-left cursor-pointer transition-colors" cdkMenuItem>Edit Approval</button>
        </li>
        <li class="flex-1">
          <button class="w-full px-8 py-2 hover:bg-gray-200 text-left cursor-pointer transition-colors" cdkMenuItem>Delete Approval</button>
        </li>
      </ul>
    </ng-template>
  `,
  imports: [CdkMenuModule]
})
export class WorkflowOptionsMenu {
}