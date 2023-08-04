import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Post } from './post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
  // variables
  private postsArr: Post[] = [];
  private postsUpdatedSubject = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostsUpdatedSubjectListener() {
    return this.postsUpdatedSubject.asObservable()
  }

  getPosts() {
    this.http.get<{ message: string; posts: Post[] }>(
      'http://localhost:3000/api/posts'
    )
      .subscribe(result => {
        this.postsArr = result.posts
        this.postsUpdatedSubject.next([...this.postsArr])
      })
  }

  addPost(author: string, title: string, content: string, image: File) {
    const postData = new FormData()
    postData.append('author', author)
    postData.append('title', title)
    postData.append('content', content)
    if (image === null) {
      postData.append('image', '')
    } else {
      postData.append('image', image, title)
    }

    this.http.post<{ message: string; postId: number; imagePath: string }>(
      'http://localhost:3000/api/posts',
      postData
    )
      .subscribe((result) => {
        const postReturned = {
          id: result.postId,
          author: author,
          title: title,
          content: content,
          imagePath: result.imagePath,
        }
        this.postsArr.push(postReturned)
        this.postsUpdatedSubject.next([...this.postsArr])
        this.router.navigate(['/'])
      })
  }

  deletePost(id: number) {
    this.http.delete(
      `http://localhost:3000/api/posts/${id}`
    )
      .subscribe(() => {
        const updatedPosts = this.postsArr.filter((post) => {
          return post.id !== id
        })
        this.postsArr = updatedPosts
        this.postsUpdatedSubject.next([...this.postsArr])
      })
  }
}
