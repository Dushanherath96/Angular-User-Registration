import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [],
})
export class RegistrationComponent {
  constructor(public formBuilder: FormBuilder) {}
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
    console.log(this.form.value);
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
