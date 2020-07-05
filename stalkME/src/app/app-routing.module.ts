import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { UserComponent } from './components/user/user.component';
//import { TimelineComponent } from "./components/timeline/timeline.component";
import { PostsComponent } from "./components/posts/posts.component";
import { ProfileComponent } from './components/user/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';


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
