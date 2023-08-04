import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  // variables
  private postsArr: Post[] = [];
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

  addPost(author: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('author', author);
    postData.append('title', title);
    postData.append('content', content);
    console.log(image);
    if (image === null) {
    postData.append('image', '')
    }
    else {
      postData.append('image', image, title)
    }
    this.http
      .post<{message: string, postId: number, imagePath: string}>('http://localhost:3000/api/posts', postData)
      .subscribe((result) => {
        const postReturned = {
          id: result.postId,
          author: author,
          title: title,
          content: content,
          imagePath: result.imagePath
        }
        this.postsArr.push(postReturned);
        this.postsUpdatedSubject.next([...this.postsArr]);
      });
  }
}
