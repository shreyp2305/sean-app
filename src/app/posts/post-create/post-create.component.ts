import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { Post } from '../post.model'
import { PostsService } from '../posts.service'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  // enteredTitle = '';
  // enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();
  form: FormGroup;
  imagePreview: string;

  constructor(public postsService: PostsService){};

  ngOnInit(): void {
    this.form = new FormGroup({
      'author': new FormControl(null, {
        validators: [Validators.required]
      }),
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null)
    });

    const imageControl = this.form.get('image');
    this.form.get('image').valueChanges.subscribe((image) => {
      if (image === null) {
        imageControl.setAsyncValidators(null);
      }
      else {
        imageControl.setAsyncValidators([mimeType])
      }
    })
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.postsService.addPost(this.form.value.author, this.form.value.title, this.form.value.content, this.form.value.image);
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}
