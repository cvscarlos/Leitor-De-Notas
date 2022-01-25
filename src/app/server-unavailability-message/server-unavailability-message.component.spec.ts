import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerUnavailabilityMessageComponent } from './server-unavailability-message.component';

describe('ServerUnavailabilityMessageComponent', () => {
  let component: ServerUnavailabilityMessageComponent;
  let fixture: ComponentFixture<ServerUnavailabilityMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerUnavailabilityMessageComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerUnavailabilityMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
