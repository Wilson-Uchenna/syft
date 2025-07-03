import { Component, OnInit, inject } from '@angular/core';
import { IonAvatar, IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { addIcons } from 'ionicons';
import { person, lockClosed, mail } from 'ionicons/icons';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
  standalone: true,
  imports: [IonItem, IonInput, IonButton, ReactiveFormsModule, IonContent, IonAvatar, IonIcon]
})
export class AuthRegisterComponent  implements OnInit {
  private modalController = inject(ModalController);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  registerForm!: FormGroup
  error: string | null = null;

  constructor() { 
    addIcons({
      person,
      lockClosed,
      mail
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.nonNullable.group({
      password_confirm: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+$')
      ]))
    }, { validators: this.passwordsMatch });
  }

  onSubmit($event: Event) {
    $event.preventDefault();

    if (!this.registerForm.valid) { return; }

    const newuser: User = {
      email: this.registerForm.controls['email'].value,
      name: this.registerForm.controls['name'].value
    };

    this.authService.register(newuser, this.registerForm.controls['password'].value)
              .then((user) => {
                this.modalController.dismiss();
              })
             .catch((e) => {
              this.error = e.statusText;
              throw e;
             });
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
  const group = control as FormGroup;
  const password = group.get('password')?.value;
  const confirm = group.get('password_confirm')?.value;

  return password === confirm ? null : { passwordsMisMatch: true };
}

}
