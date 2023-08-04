import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']

})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostsUpdatedSubjectListener().subscribe((thisPosts: Post[]) => {
      this.posts = thisPosts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(id: number) {
    this.postsService.deletePost(id);
  }
}
