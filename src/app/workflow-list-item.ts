import { Component } from "@angular/core";

@Component({
  selector: 'workflow-list-item',
  template: `
    <li class="flex flex-row items-center gap-3">
      <span class="block border-l-2 border-b-2 h-3 w-3 rounded-bl-sm"></span>
      <ng-content />
    </li>
  `
})
export class WorkflowListItem {
}