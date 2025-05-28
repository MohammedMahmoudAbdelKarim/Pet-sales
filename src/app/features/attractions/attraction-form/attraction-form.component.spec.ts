import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractionFormComponent } from './attraction-form.component';

describe('AttractionFormComponent', () => {
  let component: AttractionFormComponent;
  let fixture: ComponentFixture<AttractionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttractionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttractionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
