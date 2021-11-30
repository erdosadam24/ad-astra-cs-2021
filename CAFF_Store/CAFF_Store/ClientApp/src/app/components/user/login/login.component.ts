import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppPaths } from 'src/app/routing/app-paths';
import { ApplicationPaths, QueryParameterNames, ReturnUrlType } from 'src/app/services/user-detail/api-authorization.constants';
import { AuthenticationResultStatus, AuthorizeService } from 'src/app/services/user-detail/authorize.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup
  get username() { return this.loginForm.get('username');}
  get password() { return this.loginForm.get('password');}

  constructor(private authorizeService:AuthorizeService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public snackBar: MatSnackBar) { 
    this.loginForm = new FormGroup({
      username: new FormControl('',[Validators.required,Validators.minLength(4)]),
      password: new FormControl('',[Validators.required,Validators.minLength(4)])
    })
  }

  ngOnInit(): void {

  }

  onSubmit():void{
    if (this.loginForm.valid) {
      this.login("alma")
    } else {
      console.log("Invalid form!")
    }
  }

  private async login(returnUrl: string): Promise<void> {
    const state: INavigationState = { returnUrl };
    const result = await this.authorizeService.signIn(state);
    //Redirct on success
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        break;
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(AppPaths.SEARCH);
        break;
      case AuthenticationResultStatus.Fail:
        this.snackbarMessage("Error: " + result.message);
        break;
      default:
        throw new Error(`Invalid status result ${(result as any).status}.`);
    }
  }

  private async navigateToReturnUrl(returnUrl: string) {
    await this.router.navigateByUrl(returnUrl, {
      replaceUrl: true
    });
  }

  snackbarMessage(message:string){
    this.snackBar.open(message,"Accept",{
      duration: 4000,
    });
  }

}

interface INavigationState {
  [ReturnUrlType]: string;
}
