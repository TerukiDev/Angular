import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPack } from './open-pack';

describe('OpenPack', () => {
  let component: OpenPack;
  let fixture: ComponentFixture<OpenPack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPack],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenPack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
