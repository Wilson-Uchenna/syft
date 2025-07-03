import { Component, OnInit, inject } from '@angular/core';
import { FeedItem } from '../models/feed-item.model';
import { FeedProviderService } from '../services/feed.provider.service';
import { Subscription } from 'rxjs';
import { FeedItemComponent } from '../feed-item/feed-item.component';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow, IonSkeletonText } from '@ionic/angular/standalone';


@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
  standalone: true,
  imports: [FeedItemComponent, IonCard, 
            IonCardHeader, IonCardTitle, 
            IonCardContent, IonSkeletonText,
            IonGrid, IonCol, IonRow
           ]
})
export class FeedListComponent  implements OnInit {
  private feed = inject(FeedProviderService);

  loading = false;
  dummyItems: FeedItem[] = new Array(6).fill({ id: -1 } as FeedItem)
  feedItems: FeedItem[] = []
  subscriptions: Subscription[] = [];

  async ngOnInit() {
  this.loading = true;
    await new Promise(resolve => setTimeout(resolve, 5000));
  this.subscriptions.push(
    this.feed.currentFeed$.subscribe(items => {
      this.feedItems = items;
      this.loading = false;
    })
  );

  // Optional: add artificial delay
  

  await this.feed.getFeed();
}


  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
