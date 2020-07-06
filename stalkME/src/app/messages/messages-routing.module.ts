import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

export const routes: Routes = [
    {
        path: '', component: MainComponent,
        children: [
            { path: '', redirectTo: 'received', pathMatch: 'full' },
            { path: 'new', component: AddComponent },
            { path: 'received', component: ReceivedComponent },
            { path: 'sended', component: SendedComponent },
            { path: '**', redirectTo: 'sended'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule { }