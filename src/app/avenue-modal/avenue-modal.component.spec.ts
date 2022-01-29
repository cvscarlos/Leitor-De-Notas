import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvenueModalComponent } from './avenue-modal.component';

describe('ModalComponent', () => {
  let component: AvenueModalComponent;
  let fixture: ComponentFixture<AvenueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvenueModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvenueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
