import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  private _platform: 'AWS' | 'GITHUB' = 'GITHUB';

  constructor() { }

  getPlatform(): 'AWS' | 'GITHUB' {
    return this._platform;
  }

  setPlatform(platform: 'AWS' | 'GITHUB') {
    this._platform = platform;
  }
}
