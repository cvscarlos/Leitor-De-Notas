import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageNotesComponent } from './brokerage-notes.component';

describe('BrokerageNotesComponent', () => {
  let component: BrokerageNotesComponent;
  let fixture: ComponentFixture<BrokerageNotesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageNotesComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
