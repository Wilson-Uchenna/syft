import { TestBed } from '@angular/core/testing';

import { FeedProviderService } from './feed.provider.service';

describe('FeedProviderService', () => {
  let service: FeedProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
