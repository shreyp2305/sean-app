import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post []>();

  getPosts () {
    return [...this.posts];
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const thisPost: Post = {title: title, content: content};
    this.posts.push(thisPost);
    this.postsUpdated.next([...this.posts]);
  }

}
