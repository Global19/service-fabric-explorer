import { Component, OnInit } from '@angular/core';
import { DetailBaseComponent } from 'src/app/ViewModels/detail-table-base.component';
import { ListColumnSettingForLink } from 'src/app/Models/ListSettings';
import { Utils } from 'src/app/Utils/Utils';

@Component({
  selector: 'app-hyper-link',
  templateUrl: './hyper-link.component.html',
  styleUrls: ['./hyper-link.component.scss']
})
export class HyperLinkComponent implements OnInit, DetailBaseComponent {

  item: any;
  listSetting: ListColumnSettingForLink;

  link: string;
  value: string;

  constructor() { }

  ngOnInit() {
    this.value = Utils.result(this.item, this.listSetting.propertyPath);
    this.link = this.listSetting.href(this.item);
  }

}
