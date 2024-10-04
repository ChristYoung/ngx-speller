import { Injectable } from '@angular/core';

export type PlatFormType = 'AWS' | 'GITHUB';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  private _platform: PlatFormType = 'GITHUB';

  constructor() { }

  getPlatform(): PlatFormType {
    return this._platform;
  }

  setPlatform(platform: PlatFormType) {
    this._platform = platform;
  }
}
