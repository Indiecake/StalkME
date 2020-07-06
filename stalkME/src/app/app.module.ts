import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MessagesModule } from "./messages/messages.module";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { UserComponent } from './components/user/user.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostFormComponent } from './components/posts/post-form/post-form.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';

import { ProfileComponent } from './components/user/profile/profile.component';
import { PersonalPostComponent } from './components/user/personal-post/personal-post.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    HomeComponent,
    EditUserComponent,
    UserComponent,
    SidebarComponent,
    PostsComponent,
    PostFormComponent,
    DateAgoPipe,
    ProfileComponent,
    PersonalPostComponent,
    FollowingComponent,
    FollowersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MessagesModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
