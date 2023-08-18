import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  baseUrl: string = 'http://localhost:3000';

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;

  totalPosts: number;
  currentPage = 1;
  postsPerPage = 5;
  pageSizeOptions = [1, 5, 10];

  userId: number;
  isAuthenticated: boolean = false;
  private authSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostsUpdatedSubjectListener()
      .subscribe((postsData: { posts: Post[]; maxPosts: number }) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.maxPosts;
      });
    this.userId = this.authService.getUserId();
    this.isAuthenticated = this.authService.getAuthStatus();
    this.authSub = this.authService
      .getAuthStatusSubject()
      .subscribe((authStatus) => {
        this.userId = this.authService.getUserId();
        this.isAuthenticated = authStatus;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  onDelete(id: number) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe({
      next: () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = false;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
