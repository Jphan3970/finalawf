import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { Ingredient } from './../post-create/post.model';
import { Router } from "@angular/router";



@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  postsFromOthers: Post[] = [];

  ingredient: Ingredient[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  authStatusSub: Subscription;
  displayedColumns: string[] = ['name', 'quantity'];


  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {}

  parseIngredient(ingredients){
    return JSON.parse(ingredients)
  }

  parseStepContent(stepContent){
    return JSON.parse(stepContent)
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage, this.userId);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number; postsFromOthers: Post[] }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.postsFromOthers = postData.postsFromOthers
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }





  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage,this.userId);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage,this.userId);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  panelClick(id){

    let n: ReturnType<typeof setTimeout>;
    n = setTimeout(function(){
      let elem: HTMLElement = document.getElementById('panel_'+id+'_image');
      let headerElem : HTMLElement = document.getElementById('mat-expansion-panel-header-'+id)
      if(headerElem.classList.contains('mat-expanded')){
        elem.style.display = 'none'
      }
      else{
        elem.style.display = 'block'
      }
    }, 600);

  }
}
