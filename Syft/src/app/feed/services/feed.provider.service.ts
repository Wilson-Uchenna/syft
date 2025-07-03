import { Injectable } from '@angular/core';
import { FeedItem } from '../models/feed-item.model';
import { ApiService } from 'src/app/api/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedProviderService {
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);
  isNewUser$ = new BehaviorSubject<boolean>(false);

  constructor(private api: ApiService) { }

  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    const req = await this.api.get('/feed/0');
    const items = <FeedItem[]> req.rows;
    this.currentFeed$.next(items);
    this.isNewUser$.next(items.length === 0);
    return Promise.resolve(this.currentFeed$);
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const res = await this.api.upload('/feed', file, {caption: caption, url: file.name});
    const feed = [res, ...this.currentFeed$.value];
    this.currentFeed$.next(feed);
    return res;
  }
  clearFeed(): void {
  this.currentFeed$.next([]);           // 💨 Clears the current feed list
  this.isNewUser$.next(false);          // 🔄 Optionally reset the "new user" flag
}

}
