import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { UserComponent } from './components/user/user.component';
import { PostsComponent } from "./components/posts/posts.component";
import { ProfileComponent } from './components/user/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';
import { MessagesModule } from './messages/messages.module';

import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user/edit', component: EditUserComponent, canActivate:[AuthGuard] },
  { path: 'users', component: UserComponent, canActivate:[AuthGuard] },
  { path: 'users/:page', component: UserComponent, canActivate:[AuthGuard] },
  { path: 'timeline', component: PostsComponent, canActivate:[AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'following/:id/:page', component: FollowingComponent, canActivate:[AuthGuard]},
  { path: 'followers/:id/:page', component: FollowersComponent, canActivate:[AuthGuard]},
  { path: 'messages', loadChildren: () => MessagesModule, canActivate:[AuthGuard]},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
