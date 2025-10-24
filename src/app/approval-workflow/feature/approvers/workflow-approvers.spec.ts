import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowApprovers } from './workflow-approvers';

describe('WorkflowApprovers', () => {
  let component: WorkflowApprovers;
  let fixture: ComponentFixture<WorkflowApprovers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowApprovers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowApprovers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
