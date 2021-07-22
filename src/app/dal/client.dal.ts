import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Client } from '../models/client';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ClientDAL {
  constructor(private af: AngularFireDatabase, private notif: NotificationService) { }

  public readAll = (): AngularFireList<Array<Client>> => {
    return this.af.list('clients');
  }

  public read = (id: string): AngularFireList<Client[]> => {
    return this.af.list('clients', ref => {
      return ref.equalTo(id).orderByChild('clientId')
    });
  }

  public create = (newClient: Client): void => {
    this.af.list('clients').push(newClient).then(resp =>
      this.notif.success('New client has been added')
    );
  }

  public update = (id: string, client: Client): void => {
    this.af.list('clients').update(id, client).then(resp =>
      this.notif.success('Client ' + client.name + ' has been updated')
    );
  }

  public delete = (client: Client): void => {
    this.af.list('clients').remove(client as any).then(resp =>
      this.notif.success('Client ' + client.name + ' has been deleted')
    );
  }
}
