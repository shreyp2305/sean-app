import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private postsArr: Post[] = [];
  private postsUpdatedSubject = new Subject<Post []>();

  constructor(private http: HttpClient) {};

  getPosts () {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postsData) =>{
      this.postsArr = postsData.posts;
      this.postsUpdatedSubject.next([...this.postsArr]);
    });
  }

  getPostsUpdatedSubjectListener() {
    return this.postsUpdatedSubject.asObservable();
  }

  addPost(title: string, content: string) {
    const thisPost: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', thisPost)
    .subscribe((responseData) =>{
      console.log(responseData.message);
      this.postsArr.push(thisPost);
      this.postsUpdatedSubject.next([...this.postsArr]);
    });
  }

}
