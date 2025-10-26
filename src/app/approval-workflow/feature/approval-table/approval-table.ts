import { Component, computed, inject, linkedSignal } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { ApprovalWorkflowService } from '../../data-access/services/approval-workflow-service';
import { Rule } from '../../data-access/models/rule-model';
import { Approver } from '../../data-access/models/approver-model';
import { ApproversList } from '../../ui/approvers-list/approvers-list';
import { RulesList } from '../../ui/rules-list/rules-list';
import { ApprovalRecordsHeader } from '../approvals-header/approvals-header';

export interface ApprovalRow {
  id: string;
  approvalName: string;
  rules: Rule[];
  approvers: Approver[];
}

@Component({
  selector: 'approval-table-page',
  imports: [
    CommonModule,
    CdkTableModule,
    CdkDrag,
    CdkDropList,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    ApprovalRecordsHeader,
    ApproversList,
    RulesList
  ],
  templateUrl: './approval-table.html',
  styleUrls: ['./approval-table.css']
})
export class ApprovalTablePage {
  private readonly workflowService = inject(ApprovalWorkflowService);

  readonly displayedColumns: string[] = [
    'drag',
    'approvalName',
    'rules',
    'approvers',
    'actions'
  ];

  readonly approvals = this.workflowService.approvals;
  readonly dataSource = linkedSignal<ApprovalRow[]>(() => {
    const currentApprovals = this.approvals();

    if(currentApprovals.length > 0){
      return currentApprovals.map((a) => {

        if(a.id == null){
          throw new Error('Id should not be null');
        }

        const row: ApprovalRow = {
          id: a.id,
          approvalName: a.title,
          rules: a.rules,
          approvers: a.approvers
        }
        
        return row;
      })
    }

    return [];
  });
  readonly totalApprovals = computed(() => this.workflowService.approvals().length);

  drop(event: CdkDragDrop<ApprovalRow[]>): void {
    this.reorderApprovals(
      event.previousIndex,
      event.currentIndex
    );
  }

  private reorderApprovals(previousIndex: number, currentIndex: number): void {
    const approvals = [...this.dataSource()];
    moveItemInArray(approvals, previousIndex, currentIndex);

    this.dataSource.set(approvals);
  }

  onEdit(row: ApprovalRow): void {
    console.log('Edit:', row);
    // Open edit dialog/form
  }
  
  onDelete(row: ApprovalRow): void {
    this.workflowService.deleteApproval(row.id);
  }
}