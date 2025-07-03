import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { lockClosed, mail, person } from 'ionicons/icons';


@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  standalone: true,
  imports: [
    IonInput, IonItem, IonAvatar, IonContent, IonCheckbox, IonLabel, IonButton, ReactiveFormsModule, IonIcon
  ]
})
export class AuthLoginComponent  implements OnInit {
  loginForm!: FormGroup
  error: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private modalctrl: ModalController
  ) { 
    addIcons({
      lockClosed, mail, person
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }
  async onSubmit($event: Event) {
    $event.preventDefault();

    if (!this.loginForm.valid) { return; }

    this.auth.login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value)
      .then((user) => {
        this.modalctrl.dismiss();
      })
      .catch((e) => {
        this.error = e.statusText;
        throw e;
      });
    }
}
