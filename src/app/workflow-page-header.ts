import { Component, input } from '@angular/core';
import { ApprovalWorkflow } from './approval-workflow.model';

@Component({
  selector: 'workflow-page-header',
  template: `
  <header class="bg-white border-b border-gray-200 px-8 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-semibold text-gray-900">{{ headingText() }}</h1>
        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{{ records().length }} Records</span>
      </div>
    </div>
  </header>
  `,
})
export class WorkflowPageHeader {
  readonly headingText = input<string>('Approval Records');
  readonly records = input<ApprovalWorkflow[]>([]);
}
