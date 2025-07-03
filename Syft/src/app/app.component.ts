import { Component, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { RouterLink } from '@angular/router';
import { IonApp, IonContent, IonHeader, IonIcon, IonItem, 
         IonLabel, IonList, IonMenu, IonMenuToggle, 
         IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';
import { MenubarComponent } from './menubar/menubar.component';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader,
    IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle,
    IonItem, RouterLink, IonIcon, MenubarComponent, IonLabel
  ]
})
export class AppComponent {
  private platform = inject(Platform);

  

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' }
  ];

  public appName = environment.appName;

  constructor() {
    addIcons({ home });

    this.initializeApp();
  }

  initializeApp() {
  this.platform.ready().then(() => {
    if (Capacitor.getPlatform() !== 'web') {
      StatusBar.setStyle({ style: Style.Default });
      SplashScreen.hide();
    }
    document.title = this.appName;
  });
}

}
