import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private postsArr: Post[] = [];
  private postsUpdatedSubject = new Subject<{
    posts: Post[];
    maxPosts: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostsUpdatedSubjectListener() {
    return this.postsUpdatedSubject.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        `http://localhost:3000/api/posts${queryParams}`
      )
      .subscribe((result) => {
        this.postsArr = result.posts;
        this.postsUpdatedSubject.next({
          posts: [...this.postsArr],
          maxPosts: result.maxPosts,
        });
      });
    const temp = {};
  }

  addPost(author: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('author', author);
    postData.append('title', title);
    postData.append('content', content);
    if (image === null) {
      postData.append('image', '');
    } else {
      postData.append('image', image, title);
    }

    this.http
      .post<{ message: string; postId: number; imagePath: string }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((result) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: number) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }
}
