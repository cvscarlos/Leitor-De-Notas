import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageLimitComponent } from './usage-limit.component';

describe('UsageLimitComponent', () => {
  let component: UsageLimitComponent;
  let fixture: ComponentFixture<UsageLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
