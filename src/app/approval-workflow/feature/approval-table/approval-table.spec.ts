import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableComponent } from './approval-table';

describe('ApprovalTableComponent', () => {
  let component: ApprovalTableComponent;
  let fixture: ComponentFixture<ApprovalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
