import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { IonButton, IonContent, IonHeader, 
          IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { FeedUploadComponent } from '../feed-upload.component';
import { FeedItem } from '../../models/feed-item.model';
import { FeedListComponent } from '../../feed-list/feed-list.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FeedProviderService } from '../../services/feed.provider.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { mailUnreadOutline } from 'ionicons/icons';


@Component({
  selector: 'app-feed-upload-button',
  templateUrl: './feed-upload-button.component.html',
  styleUrls: ['./feed-upload-button.component.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonTitle, IonToolbar, IonContent, IonIcon, FeedListComponent]
})
export class FeedUploadButtonComponent  implements OnInit {
  feeds = signal<FeedItem[]>([]);
  isLoggedIn = false;
  loginSubscription!: Subscription;

  constructor( private Auth: AuthService, 
              private modalController: ModalController,
              private feed: FeedProviderService) { 
    addIcons({
      mailUnreadOutline
    });

    this.feed.getFeed().then((feed$) => {
      feed$.subscribe((items) => this.feeds.set(items));
    });
  }

  ngOnInit() {
    this.Auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  async presentUploadForm(ev: any) {
    const isDesktop = window.innerWidth >= 768;
        const modal = await this.modalController.create({
          component: FeedUploadComponent,
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

  get isEmpty() {
    return this.feeds().length === 0;
  }
}
