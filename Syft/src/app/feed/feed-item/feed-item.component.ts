import { Component, OnInit, Input } from '@angular/core';
import { FeedItem } from '../models/feed-item.model';
import { IonCard, IonCardContent, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
  standalone: true,
  imports: [IonCard, IonImg, IonCardContent]
})
export class FeedItemComponent  implements OnInit {
  
  @Input() feedItem!: FeedItem;
  constructor() { }

  ngOnInit(): void {}

}
