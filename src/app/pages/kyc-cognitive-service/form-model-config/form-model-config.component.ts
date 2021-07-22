import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Country } from "../../../models/deposit";
import { FormRecognizerModelInfo, KycIdCard } from "../../../models/kyc-cognitive";
import { AuthService } from "../../../services/auth.service";
import {NotificationService} from "../../../services/notification.service";
import { LookupService } from '../../../dal/lookup.service'
import { KycCognitiveService } from '../../../dal/kyc-cognitive.service'

@Component({
  providers: [KycCognitiveService],
  selector: 'app-form-model-config',
  templateUrl: './form-model-config.component.html',
  styleUrls: ['./form-model-config.component.css']
})
export class FormModelConfigComponent implements OnInit {
  busy: Subscription;
  error: any;
  countries: Country[] = [];
  idCards: KycIdCard[] = [];
  modelInfo = new FormRecognizerModelInfo();
  updateChild:any;

  constructor(
    private auth: AuthService,
    private notify: NotificationService,
    private lookupService: LookupService,
    private kycCognitiveService: KycCognitiveService) { }

  ngOnInit() {
    console.log("Form Recognizer Model Config")
    this.busy = this.lookupService.getCountries().subscribe(
      data => {
        this.countries = data;
      },
      error => {
        this.countries = [];
        console.log(error);
      }
    );

    this.busy = this.kycCognitiveService.getKycIdCardList().subscribe(
      data => {
        this.idCards = data;
      },
      error => {
        this.idCards = [];
        console.log(error);
      }
    );

  }

  public onSubmit() {
    try{ 
      
      console.log("Model info: ", this.modelInfo);
      this.modelInfo.validate();

    } catch(err) {
      this.notify.clear();
      this.notify.error(err, "Invalid Input");
      return ;
    }

    this.busy = this.kycCognitiveService.addUpdateFormRecognizerModelInfo(this.modelInfo)
      .subscribe(
        data => {
          this.notify.success("Added/Updated model information successfully.");
          this.modelInfo.IdCard = null;
          this.modelInfo.ModelId = "";

          this.updateChild = new Date();
        },
        error => {
            console.log(error);
            this.error = error;
        }
      );
  }

}
