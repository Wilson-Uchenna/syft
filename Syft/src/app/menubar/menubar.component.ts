import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, 
          IonMenu, IonMenuButton, IonTitle, 
          IonToolbar } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { AuthMenuButtonComponent } from '../auth/auth-menu-button/auth-menu-button.component';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  standalone: true,
  imports: [IonMenu, IonHeader, IonToolbar, IonTitle, 
            IonContent, IonButtons, IonMenuButton,
            AuthMenuButtonComponent]
})
export class MenubarComponent  implements OnInit {

  appName = environment.appName;

  constructor() { }

  ngOnInit(): void {}

}
