import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproversList } from './approvers-list';

describe('ApproversList', () => {
  let component: ApproversList;
  let fixture: ComponentFixture<ApproversList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproversList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproversList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
