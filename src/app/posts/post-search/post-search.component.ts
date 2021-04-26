import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-search',
  templateUrl: './post-search.component.html',
  styleUrls: ['./post-search.component.scss']
})
export class PostSearchComponent implements OnInit {

  posts: Post[] = [];
  private postsSub: Subscription;
  userIsAuthenticated = false;
  userId: string;


  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
  }


  onEnter(event)
  {
    let keyWord = event.target.value;
    this.postsService.getPostsByTitleKeyWord(keyWord, this.userId);
  }

}
