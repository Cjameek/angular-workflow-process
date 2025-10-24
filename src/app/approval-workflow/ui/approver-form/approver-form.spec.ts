import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverForm } from './approver-form';

describe('ApproverForm', () => {
  let component: ApproverForm;
  let fixture: ComponentFixture<ApproverForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
