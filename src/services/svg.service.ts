import { Injectable } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(private iconService: NzIconService) { }

  init(): void {
    this.svgCreator();
  }

  private svgCreator(): void {
    // shutup: we cannot pronounce the word
    this.iconService.addIconLiteral(
      'sp:shutup',
      '<svg t="1725246367773" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1268" width="200" height="200"><path d="M364.8 454.4c-32 0-57.6-25.6-57.6-57.6s25.6-57.6 57.6-57.6 57.6 25.6 57.6 57.6-25.6 57.6-57.6 57.6zM659.2 454.4c-32 0-57.6-25.6-57.6-57.6s25.6-57.6 57.6-57.6 57.6 25.6 57.6 57.6c-6.4 32-32 57.6-57.6 57.6zM512 748.8l-128 89.6-32-44.8 115.2-76.8-115.2-83.2 32-38.4 128 89.6 128-89.6 32 38.4-115.2 83.2 115.2 76.8-32 44.8z" p-id="1269"></path><path d="M512 64C262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448-198.4-448-448-448z m281.6 729.6c-38.4 38.4-76.8 64-128 83.2-44.8 19.2-102.4 32-153.6 32s-108.8-12.8-153.6-32-89.6-51.2-128-83.2c-38.4-38.4-64-76.8-83.2-128-19.2-44.8-32-102.4-32-153.6 0-51.2 12.8-108.8 32-153.6s51.2-89.6 83.2-128c38.4-38.4 76.8-64 128-83.2 44.8-19.2 102.4-32 153.6-32 51.2 0 108.8 12.8 153.6 32s89.6 51.2 128 83.2 64 76.8 83.2 128c19.2 44.8 32 102.4 32 153.6 0 51.2-12.8 108.8-32 153.6-19.2 51.2-44.8 89.6-83.2 128z" p-id="1270"></path></svg>'
    )
  }
}
