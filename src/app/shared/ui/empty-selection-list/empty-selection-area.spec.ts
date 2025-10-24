import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptySelectionArea } from './empty-selection-area';

describe('EmptySelectionArea', () => {
  let component: EmptySelectionArea;
  let fixture: ComponentFixture<EmptySelectionArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptySelectionArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptySelectionArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
