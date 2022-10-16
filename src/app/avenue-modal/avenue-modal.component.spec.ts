import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexModalComponent } from './avenue-modal.component';

describe('ModalComponent', () => {
  let component: ApexModalComponent;
  let fixture: ComponentFixture<ApexModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApexModalComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
