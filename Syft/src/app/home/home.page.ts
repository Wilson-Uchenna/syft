import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { FeedUploadButtonComponent } from '../feed/feed-upload/feed-upload-button/feed-upload-button.component';
import { FeedListComponent } from '../feed/feed-list/feed-list.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, FeedUploadButtonComponent, FeedListComponent],
})
export class HomePage {
  constructor() {}
}
