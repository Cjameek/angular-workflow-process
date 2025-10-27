import { Routes } from '@angular/router';
import { AddWorkflowPage } from './approval-workflow/feature/add-workflow/add-workflow';
import { ApprovalTablePage } from './approval-workflow/feature/approval-table/approval-table';

export const routes: Routes = [
  {
    path: '',
    component: ApprovalTablePage
  },
  {
    path: 'add-workflow',
    component: AddWorkflowPage
  },
  {
    path: 'edit-workflow',
    component: AddWorkflowPage
  }
];
