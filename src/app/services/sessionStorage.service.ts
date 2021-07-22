import { Injectable } from "@angular/core";

@Injectable()
export class SessionStorageService {

    public addItem(key: string, item: any): void {
        sessionStorage.setItem(key, JSON.stringify(item));
    }

    public getItem(key: string): any {
        var item = sessionStorage.getItem(key);
        if(!item) return null;
        if(item == 'true') return true;
        if(item == 'false') return false;
        return JSON.parse(item);
    }
}