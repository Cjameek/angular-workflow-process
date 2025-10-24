import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleFormDialog } from './rule-form-dialog';

describe('RuleFormDialog', () => {
  let component: RuleFormDialog;
  let fixture: ComponentFixture<RuleFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
