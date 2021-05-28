import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassivesComponent } from './passives.component';

describe('PassivesComponent', () => {
  let component: PassivesComponent;
  let fixture: ComponentFixture<PassivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
