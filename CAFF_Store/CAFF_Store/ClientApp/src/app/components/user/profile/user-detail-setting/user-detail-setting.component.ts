import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail-setting',
  templateUrl: './user-detail-setting.component.html',
  styleUrls: ['./user-detail-setting.component.scss']
})
export class UserDetailSettingComponent implements OnInit {

  userDetailsForm:FormGroup;
  oldPasswordForm:FormGroup;

  get username() { return this.userDetailsForm.get('username');}
  get email() { return this.userDetailsForm.get('email');}
  get oldPassword() { return this.oldPasswordForm.get('oldPassword');}
  get newPassword() { return this.oldPasswordForm.get('newPassword');}
  get newPasswordAgain() { return this.oldPasswordForm.get('newPasswordAgain');}


  constructor() { 
    this.userDetailsForm = new FormGroup({
      username: new FormControl('TODO: Load from service!', [Validators.required,Validators.minLength(4)]),
      email: new FormControl('TODO: Load from service!', [Validators.required, Validators.email]),
    })

    this.oldPasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required,Validators.minLength(4)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      newPasswordAgain: new FormControl('', [Validators.required, Validators.minLength(4)]),
    })
  }

  ngOnInit(): void {
    
  }

  
  onSaveUserDetailSettings(){
    if (this.userDetailsForm.valid) {
      this.saveUserDetails()
    } else {
      console.log("Invalid form!")
    }
  }

  onSavePassword(){
    
  }

  
  saveUserDetails(){
    alert('TODO: Implement!')
  }

}
