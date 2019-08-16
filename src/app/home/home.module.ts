import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ListChatDirective } from '../directives/list-chat.directive';
import { ListChatPage } from '../chat/list-chat/list-chat.page';
import { ListConselingPage } from '../conseling/list-conseling/list-conseling.page';
import { ListConselingDirective } from '../directives/list-conseling.directive';
import { WeeklyPage } from '../schedule/weekly/weekly.page';
import { WeeklyDirective } from '../directives/weekly.directive';
import { RoomChatPage } from '../chat/room-chat/room-chat.page';
import { ConselingResultPage } from '../conseling/conseling-result/conseling-result.page';
import { CalendarModule } from 'ion2-calendar';
import { SetSchedulePage } from '../schedule/set-schedule/set-schedule.page';
import { DetailComplaintPage } from '../administrator/detail-complaint/detail-complaint.page';
import { NoteComplaintPage } from '../administrator/note-complaint/note-complaint.page';
import { ConselorSelectionPage } from '../administrator/conselor-selection/conselor-selection.page';
import { AdministratorDirective } from '../directives/administrator.directive';
import { AdministratorPage } from '../administrator/administrator.page';
import { CallerPage } from '../chat/caller/caller.page';
import { ReceiveCallPage } from '../chat/receive-call/receive-call.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { VidcallPage } from '../chat/vidcall/vidcall.page';
@NgModule({
  entryComponents: [
    ListChatPage,
    ListConselingPage,
    WeeklyPage,
    RoomChatPage,
    ConselingResultPage,
    SetSchedulePage,
    DetailComplaintPage,
    NoteComplaintPage,
    ConselorSelectionPage,
    AdministratorPage,
    CallerPage,
    ReceiveCallPage,
    VidcallPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    NativeAudio
  ],
  declarations: [
    HomePage,
    ListChatPage,
    ListChatDirective,
    ListConselingPage,
    ListConselingDirective,
    WeeklyPage,
    WeeklyDirective,
    RoomChatPage,
    ConselingResultPage,
    SetSchedulePage,
    DetailComplaintPage,
    NoteComplaintPage,
    ConselorSelectionPage,
    AdministratorDirective,
    AdministratorPage,
    CallerPage,
    ReceiveCallPage,
    VidcallPage
  ]
})
export class HomePageModule {}
