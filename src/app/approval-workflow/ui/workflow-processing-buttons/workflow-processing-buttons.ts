import { Component, output } from "@angular/core";

@Component({
  selector: 'workflow-processing-buttons',
  template: `
    <div class="flex flex-row justify-end gap-3">
      <button 
        id="cancelApprovalBtn"
        type="button" 
        class="btn secondary" 
        (click)="onCancel.emit()"
      >
        Cancel
      </button>
      <button 
        id="submitApprovalBtn"
        class="btn" 
        (click.prevent)="onSave.emit()"
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