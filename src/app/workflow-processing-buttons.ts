import { Component, input, output } from "@angular/core";

@Component({
    selector: 'workflow-processing-buttons',
    template: `
    <div class="flex flex-row justify-end gap-3">
        <button 
            type="button" 
            class="px-3 py-2 border-2 border-gray-200 font-bold rounded-sm cursor-pointer" 
            (click)="onCancel.emit()"
        >
            Cancel
        </button>
        <button 
            type="button" 
            class="px-3 py-2 bg-gray-200 font-bold rounded-sm cursor-pointer" 
            (click)="onSave.emit()" 
            [disabled]="saveDisabled()"
        >
            Save
        </button>
    </div>
  `
})
export class WorkflowProcessingButtons {
    readonly saveDisabled = input<boolean>(false);
    readonly onCancel = output<void>();
    readonly onSave = output<void>();
}