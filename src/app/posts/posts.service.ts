import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number; postsFromOthers: Post[]; }>();

  constructor(private http: HttpClient, private router: Router) {}


  getPostsByTitleKeyWord(keyWord: any, currentId: string) {
    if(currentId == undefined){
      currentId="0"
    }
    keyWord = keyWord+"-"+currentId

    this.http
    .get<{ message: string; posts: any; maxPosts: number }>(
      BACKEND_URL+"/search/"+keyWord
    )
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              ingredients: post.ingredients,
              stepContent: post.stepContent,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator,
              isItPrivate: post.isItPrivate
            };
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe(transformedPostData => {
      let tempFetchPosts = transformedPostData.posts
      let otherPosts
      if(currentId == '0' || currentId == undefined){
        tempFetchPosts = transformedPostData.posts.filter(post=>post.isItPrivate.toString() == 'false')
      }
      else{
        otherPosts = transformedPostData.posts.filter(post=>post.creator.toString() != currentId && post.isItPrivate.toString() == 'false')
        tempFetchPosts = transformedPostData.posts.filter(post=>post.creator.toString() == currentId )
      }
      this.posts = tempFetchPosts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts,
        postsFromOthers: otherPosts
      });
    });
  }


  getPosts(postsPerPage: number, currentPage: number, currentId: string) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    if(currentId == undefined){
      currentId="0"
    }
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL+"/all/"+currentId + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                ingredients: post.ingredients,
                stepContent: post.stepContent,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                isItPrivate: post.isItPrivate
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        let tempFetchPosts = transformedPostData.posts
        let otherPosts
        // If it
if(currentId == '0' || currentId == undefined){
          tempFetchPosts = transformedPostData.posts.filter(post=>post.isItPrivate.toString() == 'false')
        }
        else{
          tempFetchPosts = transformedPostData.posts.filter(post=>post.creator.toString() == currentId )
          otherPosts = transformedPostData.posts.filter(post=>post.creator.toString() != currentId && post.isItPrivate.toString() == 'false')
        }


        this.posts = tempFetchPosts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
          postsFromOthers: otherPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      ingredients: string;
      stepContent: string;
      imagePath: string;
      creator: string;
      isItPrivate: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, image: File, ingredients: string, stepContent: string, isItPrivate: string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("image", image, title);
    postData.append("ingredients", ingredients);
    postData.append("stepContent", stepContent);
    postData.append("isItPrivate", isItPrivate);


    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, ingredients: string,stepContent: string, image: File | string, isItPrivate: string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("ingredients",ingredients)
      postData.append("stepContent",stepContent)
      postData.append("image", image, title);
      postData.append("isItPrivate", isItPrivate);

    } else {
      postData = {
        id: id,
        title: title,
        ingredients: ingredients,
        stepContent: stepContent,
        imagePath: image,
        creator: null,
        isItPrivate: isItPrivate
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
