import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  form!: FormGroup;
  isLoggingIn!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    this.form = formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  loginClick() {
    this.isLoggingIn = true;

    this.authenticationService
      .signIn(this.form.value.email, this.form.value.password)
      .subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
        error: (error: any) => {
          this.isLoggingIn = false;
          this.openSnackBar(error.message, 'OK', 5000);
        },
      });
  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    });
  }
}
