import { Component, input, output } from "@angular/core";

@Component({
  selector: 'workflow-processing-buttons',
  template: `
    <div class="flex flex-row justify-end gap-3">
      <button 
        id="cancelApprovalBtn"
        type="button" 
        class="px-3 py-2 border-2 border-gray-200 font-bold rounded-sm cursor-pointer" 
        (click)="onCancel.emit()"
      >
        Cancel
      </button>
      <button 
        id="submitApprovalBtn"
        class="px-3 py-2 bg-gray-200 font-bold rounded-sm cursor-pointer" 
        (click)="onSave.emit()"
      >
        Save
      </button>
    </div>
  `
})
export class WorkflowProcessingButtons {
  readonly onCancel = output<void>();
  readonly onSave = output<void>();
}