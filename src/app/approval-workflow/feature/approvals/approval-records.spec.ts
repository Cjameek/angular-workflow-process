import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRecords } from './approval-records';

describe('ApprovalRecords', () => {
  let component: ApprovalRecords;
  let fixture: ComponentFixture<ApprovalRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
