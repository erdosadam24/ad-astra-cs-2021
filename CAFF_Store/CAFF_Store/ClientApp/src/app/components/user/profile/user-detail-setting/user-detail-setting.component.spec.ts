import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailSettingComponent } from './user-detail-setting.component';

describe('UserDetailSettingComponent', () => {
  let component: UserDetailSettingComponent;
  let fixture: ComponentFixture<UserDetailSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
