import { AbstractControl, ValidatorFn } from "@angular/forms";

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumberRegex = /^[0-9]{10}$/; // Modify this regex as needed to match your mobile number format

    if (!phoneNumberRegex.test(control.value)) {
      return { invalidPhoneNumber: true };
    }

    return null;
  };
}
