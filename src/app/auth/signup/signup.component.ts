import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  form: FormGroup;
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onSignUp() {
    if (this.form.invalid) {
      return;
    }
    this.authService.createUser(
      this.form.value.email,
      this.form.value.password
    );
  }
}
