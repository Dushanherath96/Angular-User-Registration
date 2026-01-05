import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [],
})
export class RegistrationComponent {
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  isSubmitted: boolean = false;

  // Custom validator to check if password and confirmPassword match
  // ValidatorFn is a function that takes an AbstractControl and returns either null or an object with validation errors.
  passwordMatchValidaor: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true });
    else confirmPassword?.setErrors(null);

    return null;
  };

  // Reactive form definition
  form = this.formBuilder.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
        ],
      ],
      confirmPassword: [''],
    },
    { validators: this.passwordMatchValidaor }
  );

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      // Send form data to backend via AuthService
      const payload = this.form.value;
      this.authService.createUser(this.form.value).subscribe({
        next: (res: any) => {
          console.log('Registration successful', res);
          this.toastr.success(
            'Registration successful! Please sign in.',
            'Success'
          );
          // If backend returns a flag indicating success, redirect to sign-in
          if (
            res &&
            (res.succeeded === true || res.success === true || res.id)
          ) {
            // reset and redirect to sign-in
            this.form.reset();
            this.isSubmitted = false;
            // navigate to sign in page after successful registration
            this.router.navigate(['/signin']);
            return;
          }
          // fallback: show success and navigate anyway if response is truthy
          if (res) {
            this.form.reset();
            this.isSubmitted = false;
            this.router.navigate(['/signin']);
            return;
          }
        },
        error: (err) => console.log('error', err),
      });
    }
  }

  // Method to check if a control has displayable error
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
  }
}
