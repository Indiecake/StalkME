import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { UserComponent } from './user/user.component';
//import { TimelineComponent } from "./timeline/timeline.component";
import { PostsComponent } from "./posts/posts.component";
import { ProfileComponent } from './user/profile/profile.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user/edit', component: EditUserComponent },
  { path: 'users', component: UserComponent },
  { path: 'users/:page', component: UserComponent },
  { path: 'timeline', component: PostsComponent},
  { path: 'profile/:id', component: ProfileComponent},
  { path: 'following/:id/:page', component: FollowingComponent},
  { path: 'followers/:id/:page', component: FollowersComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
