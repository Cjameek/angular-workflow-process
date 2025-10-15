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
      <ul class="bg-white p-4 shadow" cdkMenu>
        <li>
          <button cdkMenuItem>Undo</button>
        </li>
        <li>
          <button cdkMenuItem>Redo</button>
        </li>
      </ul>
    </ng-template>
  `,
  imports: [CdkMenuModule]
})
export class WorkflowOptionsMenu {
}