import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialsComponent } from './trials.component';

describe('TrialsComponent', () => {
  let component: TrialsComponent;
  let fixture: ComponentFixture<TrialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TrialsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
