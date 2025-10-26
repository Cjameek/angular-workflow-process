import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowForm } from './add-workflow-form';

describe('AddWorkflowForm', () => {
  let component: AddWorkflowForm;
  let fixture: ComponentFixture<AddWorkflowForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkflowForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkflowForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
