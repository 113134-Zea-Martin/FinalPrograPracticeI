import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoModoComponent } from './nuevo-modo.component';

describe('NuevoModoComponent', () => {
  let component: NuevoModoComponent;
  let fixture: ComponentFixture<NuevoModoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoModoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoModoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
