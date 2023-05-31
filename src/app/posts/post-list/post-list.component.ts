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
  // posts = [
    // {title: 'First post', content: 'This is the first post\'s content'},
    // {title: 'Second post', content: 'This is the second post\'s content'},
    // {title: 'Third post', content: 'This is the third post\'s content'}
  // ]
  // @Input() posts: Post[] = [];
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
}
