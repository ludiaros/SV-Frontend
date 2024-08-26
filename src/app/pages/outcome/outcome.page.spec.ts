import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomePage } from './outcome.page';

describe('OutcomePage', () => {
  let component: OutcomePage;
  let fixture: ComponentFixture<OutcomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutcomePage],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(OutcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
