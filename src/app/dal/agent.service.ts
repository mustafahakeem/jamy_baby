import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Agent, AgentProfile, AgentSearch, AgentSearchView } from "../models/agent";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AgentService {
    constructor(private httpClient: HttpClient, 
        private authService: AuthService) { }

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Device-Client-Id': 'mydevice1'
    });

    public registerAgent(agent: Agent) {
        const url = `${environment.api.James.domain}/api/Agent/Register`;
        return this.postData(url, agent);
    }

    postData(url, object) {
        const body = JSON.stringify(object);

        return this.httpClient.post(url, body, {headers: this.headers}).map((data: any) => {
            return data;
        })
            .catch(this.observableHandleError);
    }

    private observableHandleError(error: any) {
        console.log(error);
        return Observable.throw(error);
    }

    public getAgentDetail(agentNumber: number): Observable<AgentProfile> {
        const url = `${environment.api.James.domain}/api/Agent/GetAgent?agentNumber=` + agentNumber;

        return this.httpClient.get(url).map((data: AgentProfile) => data)
            .catch(this.observableHandleError);
    }

    public getAgentShortDetail(agentNumber: number): Observable<AgentSearchView> {
        const url = `${environment.api.James.domain}/api/Agent/GetShortDetails?agentNumber=` + agentNumber;

        return this.httpClient.get(url).map((data: AgentSearchView) => data)
            .catch(this.observableHandleError);
    }

    public searchAgents(command: AgentSearch) {
        const url = `${environment.api.James.domain}/api/Agent/Search`;
        command.agentNumber = command.agentNumber || 0;
        return this.postData(url, command);
    }

    public isAgentSupervisor(): boolean {
        return this.authService.isUserHasInPermissionGroup("AgentSupervisor");
    }
}
