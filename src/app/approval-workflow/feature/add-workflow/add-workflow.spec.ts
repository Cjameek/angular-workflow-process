import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflow } from './add-workflow';

describe('AddWorkflow', () => {
  let component: AddWorkflow;
  let fixture: ComponentFixture<AddWorkflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkflow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkflow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
