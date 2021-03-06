import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { CreateClientComponent } from '../create-client/create-client.component';

@Component({
  selector: 'ngx-header-clients',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderClientComponent {

  constructor(
    private dialogService: NbDialogService,
  ) { }

  createClient() {
     this.dialogService.open(CreateClientComponent, {
      context: {
        title: 'Create Client',
      },
      closeOnBackdropClick: false,
    });
  }
}
