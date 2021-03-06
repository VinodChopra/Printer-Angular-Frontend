import { Component } from '@angular/core';
import {HttpService} from '../service/http.service';
import { Socket } from 'ngx-socket-io';
import { DocSize, ScanToEmailDefault } from '../constant';

@Component({
  selector: 'app-scan-to-email',
  templateUrl: './scan-to-email.component.html',
  styleUrls: ['./scan-to-email.component.scss']
})
export class ScanToEmailComponent {
public scanToEmailData = ScanToEmailDefault;
public defaultScanToEmail = ScanToEmailDefault;
public scanToEmailType = {
  TxProfiles: {
    Smtp: {
      Destination: 'text',
      Subject: 'text',
      MsgBody: 'text',
      FileName: 'text',
    }
  },
  FileNameFixed: 'checkbox',
  ScanTray: 'select', 						// ScanTray
  ColorMode: 'select', 						// ColorModeList
  Resolution: 'select', 					// Resolution
  DocSize: 'select', 						// DocSize
  Density: 'select', 						// selectionList_1
  Brightness: 'select', 					// selectionList_1
  JpgQuality: 'select', 					// selectionList_2
  FileType: 'select',						// FileType
  SPdfPassword: 'text',
  SinglePageFile: 'checkbox',
  AdditionalAdfScan: 'checkbox',
  ResumeAfterError: 'checkbox',
  AutoDeskew: 'checkbox',
  SkipBlankPage: 'checkbox',
  SkipBlankPageSensitivity: 'select', 		// selectionList_1
  RemoveBackground: 'select', 				// selectionList_2
  DuplexScanEnable: 'checkbox',
  ShortEdgeBinding: 'checkbox',
  ColorDetectionAccuracyLevel: 'text',
  GrayDetectionAccuracyLevel: 'text',
  Margin: 'text',							// Margin
  JobFinAckUrl: 'text'
};
public scanTrayList = ['FB', 'ADF', 'Auto'];
public colorModeList = ['Color', 'Gray', 'Mono', 'Auto'];
public resolutionList = ['Normal', 'Low', 'High', '600', '400', '300', '200', '150', '100', '200x100', 'Auto'];
public fileTypeList = ['PDF', 'JPEG', 'HighCompressedPDF', 'PDFA', 'SecurePDF', 'SignedPDF', 'XPS', 'TIFF'];
public docSizeList = DocSize;
public isMultiple = false;
public canMultiSelect = false;
public multiEmail = [];
public email = '';
public password = '';
public message = '';
public noOfEmial = 1;
  public result = '';
  public messageRequest = {message: ''};
  public closeRequest = {close: false};
  constructor(private http: HttpService, private socket: Socket) {
    this.socket.on('getJson', (data) => {
      console.log(data);
      this.result = data.s === 'ScanToEmail' ? data.data : this.result;
    });
  }
  send(multiEmail) {
    if (!multiEmail) {
      this.http.post('/file/commandjson/add', {ScanToEmail: this.scanToEmailData}).subscribe(() => {
        // this.scanToEmailData = {
        //   Destination: "",
        //   ScanTray: "ADF",
        //   ColorMode: "Color",
        //   Resolution: "Normal",
        //   FileType: "PDF"
        // }
      });
    } else {
      const data = {
        Destination: this.multiEmail.filter(function(e) {return e; }),
        ScanTray: this.scanToEmailData.ScanTray,
        ColorMode: this.scanToEmailData.ColorMode,
        Resolution: this.scanToEmailData.Resolution,
        FileType: this.scanToEmailData.FileType,
        DocSize: this.scanToEmailData.DocSize,
        DuplexScanEnable: this.scanToEmailData.DuplexScanEnable,
      };
      this.http.post('/file/commandjson/add/', {ScanToEmail: data}).subscribe(() => {
        this.scanToEmailData = this.defaultScanToEmail;
        this.multiEmail = [];
        this.noOfEmial = 1;
      });
    }
  }
  applyPassword() {
    this.http.post('/file/commandjson/add', {password: this.password}).subscribe(() => {
      this.password = '';
    });
  }

  addEmail() {
    this.multiEmail.push(this.email);
    this.email = '';
  }

  numberReturn(length) {
    return Array.from({length}, (v, k) => k + 1);
  }

  public applyMessage() {
    this.messageRequest.message = this.message;
    this.http.post('/file/commandjson/add',  this.messageRequest).subscribe(() => {
      this.message = '';
    });
  }

  public close() {
    this.closeRequest.close = true;
    this.http.post('/file/commandjson/add', this.closeRequest).subscribe(() => {
    });
  }
}
