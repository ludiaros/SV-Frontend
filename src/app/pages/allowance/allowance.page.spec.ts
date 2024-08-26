import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowancePage } from './allowance.page';

describe('AllowancePage', () => {
  let component: AllowancePage;
  let fixture: ComponentFixture<AllowancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllowancePage],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(AllowancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
