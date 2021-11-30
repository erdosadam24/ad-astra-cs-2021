import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm:FormGroup;

  get username() { return this.registrationForm.get('username');}
  get password() { return this.registrationForm.get('password');}
  get passwordAgain() { return this.registrationForm.get('passwordAgain');}
  get email() { return this.registrationForm.get('email');}

  constructor() { 
    this.registrationForm = new FormGroup({
      username: new FormControl('', [Validators.required,Validators.minLength(4)]),
      password: new FormControl('', [Validators.required,Validators.minLength(4)]),
      passwordAgain: new FormControl('', [Validators.required,Validators.minLength(4)]),
      email: new FormControl('', [Validators.required,Validators.email])
    })
  }

  ngOnInit(): void {
  }

  onSubmit():void{
    if (this.registrationForm.valid) {
      this.registrate()
    } else {
      console.log("Invalid form!")
    }
  }

  registrate(){
    alert('TODO!')
  }

}
