import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '../../models/client';
import { ClientDAL } from '../../dal/client.dal';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AngularFireList } from '@angular/fire/database';

@Component({
  providers: [ClientDAL],
  selector: 'app-client',
  styleUrls: ['./client.component.css'],
  templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit, OnDestroy {
  public clients: AngularFireList<Array<Client>>;

  constructor(private dal: ClientDAL, private breadServ: BreadcrumbService) {
    // TODO
  }

  public ngOnInit() {
    this.clients = this.dal.readAll();
    this.breadServ.set({
      description: 'This is our Client page',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'clock-o',
          link: ['/client'],
          title: 'Client'
        }
      ]
    });

  }

  public ngOnDestroy() {
    this.breadServ.clear();
    this.clients = null;
  }

  private save = (client: Client): void => {
    this.dal.update(client.clientId, new Client(client.name, client.clientId, client.address));
  }

  private delete = (client: Client): void => {
    this.dal.delete(client);
  }

  public add = (): void => {
    this.dal.create(new Client());
  }
}
