import { Component, OnInit, inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FeedProviderService } from '../services/feed.provider.service';
import { IonButton, IonContent, IonItem, IonLabel, IonTextarea, LoadingController, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-feed-upload',
  templateUrl: './feed-upload.component.html',
  styleUrls: ['./feed-upload.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonContent, IonItem, IonButton, IonTextarea]
})
export class FeedUploadComponent  implements OnInit {
  private feed = inject(FeedProviderService);
  private formBuilder = inject(FormBuilder);
  private loadingController = inject(LoadingController);
  private modalController = inject(ModalController);

  previewDataUrl!: string | null;
  file!: File;
  uploadForm!: FormGroup;

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      caption: new FormControl('', Validators.required)
    });
  }

  setPreviewDataUrl(file: Blob) {
    const reader  = new FileReader();
    reader.onloadend = () => {
      this.previewDataUrl = typeof reader.result === 'string' ? reader.result : null;
    };

    reader.readAsDataURL(file);
  }

selectImage(event: Event): void {
  const input = event.target as HTMLInputElement | null;

  if (!input?.files?.length) return;

  this.file = input.files[0];
  this.setPreviewDataUrl(this.file);
}





  onSubmit($event: Event) {
    $event.preventDefault();
    this.loadingController.create();

    if (!this.uploadForm.valid || !this.file) { return; }
    this.feed.uploadFeedItem(this.uploadForm.controls['caption'].value, this.file)
      .then((result) => {
        this.modalController.dismiss();
        this.loadingController.dismiss();
      });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
