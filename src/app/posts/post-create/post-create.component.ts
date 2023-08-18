import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  imagePreview: string;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });

    const imageControl = this.form.get('image');
    this.form.get('image').valueChanges.subscribe((image) => {
      if (image === null) {
        imageControl.setAsyncValidators(null);
      } else {
        imageControl.setAsyncValidators([mimeType]);
      }
    });

    this.authStatusSub = this.authService
      .getAuthStatusSubject()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.postsService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    );
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
