import { Component, OnInit } from '@angular/core';

import { AuthMenuUserComponent } from './auth-menu-user/auth-menu-user.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthLoginComponent } from '../auth-login/auth-login.component';
import { AuthRegisterComponent } from '../auth-register/auth-register.component';
import { IonButton, IonItemGroup, ModalController,  } from '@ionic/angular/standalone';
import { FeedProviderService } from 'src/app/feed/services/feed.provider.service';


@Component({
  selector: 'app-auth-menu-button',
  templateUrl: './auth-menu-button.component.html',
  styleUrls: ['./auth-menu-button.component.scss'],
  standalone: true,
  imports: [ CommonModule, AuthMenuUserComponent, AuthLoginComponent, AuthRegisterComponent,
              IonItemGroup, IonButton
  ]
})
export class AuthMenuButtonComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public modalController: ModalController,
    public feedService: FeedProviderService
    ) {}

  async presentmodal() {
    const modal = await this.modalController.create({
      component: AuthMenuUserComponent,

      
    });
    return await modal.present();
  }

  async presentLogin() {
    const isDesktop = window.innerWidth >= 768;
    const modal = await this.modalController.create({
      component: AuthLoginComponent,
      cssClass: isDesktop ? 'glass-modal' : 'transparent-modal',
    backdropDismiss: true,
    ...(isDesktop ? {} : {
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1
    }),
    //  presentingElement: await this.modalController.getTop(),
  });
    return await modal.present();
  }

  async presentRegister() {
  const isDesktop = window.innerWidth >= 768;
    const modal = await this.modalController.create({
      component: AuthRegisterComponent,
      cssClass: isDesktop ? 'glass-modal' : 'transparent-modal',
    backdropDismiss: true,
    ...(isDesktop ? {} : {
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1
    }),
     presentingElement: await this.modalController.getTop(),
  });
    return await modal.present();
}


  logout() {
  this.auth.logout();
  this.feedService.clearFeed(); // 👈 Clear feed data on logout
}

  ngOnInit() {}

}
