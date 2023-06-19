import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private postsUpdatedSubject = new Subject<Post []>();

  constructor(private http: HttpClient) {};
  getPostsUpdatedSubjectListener() {
    return this.postsUpdatedSubject.asObservable();
  }

  private postsArr: Post[] = [];
  getPosts () {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postsData) =>{
      this.postsArr = postsData.posts;
      this.postsUpdatedSubject.next([...this.postsArr]);
    });
  }

  addPost(author: string, title: string, content: string) {
    const thisPost: Post = {author: author, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', thisPost).subscribe();
  }

}
