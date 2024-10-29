import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Subject, debounceTime, finalize, takeUntil } from 'rxjs';
import { ScrollControlDirective } from '../../directives/scroll-control.directive';
import { DbService } from '../../services/DataBase/db.service';
import { FileService } from '../../services/file.service';
import { setWordsList } from '../../store/words/words.actions';
import { WordsItem, WordType } from '../../types';
import { frontEndSearchWordsByKeyword } from '../../utils';
import { EmptyComponent } from '../../widgets/empty/empty.component';
import { HornComponent } from '../../widgets/horn/horn.component';
import { SidePanelDetailsComponent } from '../../widgets/side-panel-details/side-panel-details.component';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-governance',
  standalone: true,
  template: `
    <div class="page_container" id="scrollBar" #scrollBar>
      <div class="title_row" nz-row [nzGutter]="24">
        <div nz-col [nzSpan]="2">
          <input
            nz-input
            placeholder="Search words"
            [(ngModel)]="searchKey"
            (ngModelChange)="searchKeySubject$.next($event)"
          />
        </div>
        <div nz-col [nzSpan]="18">
          <nz-select
            style="width: 120px"
            [(ngModel)]="wordType"
            nzPlaceHolder="Word type"
            (ngModelChange)="wordTypeSubject$.next($event)"
          >
            <nz-option nzValue="ALL" nzLabel="All"></nz-option>
            <nz-option nzValue="WORD" nzLabel="Word"></nz-option>
            <nz-option nzValue="PHRASE" nzLabel="Phrase"></nz-option>
          </nz-select>
          <button nz-button nz-dropdown [nzDropdownMenu]="menu888" [nzTrigger]="'click'">
            Actions
            <span nz-icon nzType="down"></span>
          </button>
          <nz-dropdown-menu #menu888="nzDropdownMenu">
            <ul nz-menu>
              <li nz-menu-item (click)="pickUp()">
                <span nz-icon nzType="sp:pickup" nzTheme="outline"></span>
                <span>Pick Up</span>
              </li>
              <li nz-menu-item (click)="bulkRemoveWords()">
                <span nz-icon nzType="delete" nzTheme="outline"></span>
                <span>Bulk Remove</span>
              </li>
              <li nz-menu-item (click)="clickViewJsonSchema()">
                <span nz-icon nzType="download" nzTheme="outline"></span>
                <span>Export Words</span>
              </li>
            </ul>
          </nz-dropdown-menu>
        </div>
      </div>
      @if (dataSource?.length > 0) {
        <div class="table_container">
          <nz-table
            #headerTable
            [nzData]="dataSource"
            [nzSize]="'small'"
            [nzFrontPagination]="false"
          >
            <thead>
              <tr>
                <th
                  [nzWidth]="'40px'"
                  [nzChecked]="allChecked"
                  nzLabel="Select all"
                  (nzCheckedChange)="onAllChecked($event)"
                ></th>
                <th [nzWidth]="'60px'">Order</th>
                <th [nzSortFn]="sortFnByLetter" [nzSortPriority]="1">Word</th>
                <th [nzWidth]="'300px'">Phonetic</th>
                <th [nzWidth]="'150px'" style="text-align: right">Created Date</th>
                <th
                  [nzWidth]="'300px'"
                  [nzSortFn]="sortFnByRightRate"
                  [nzSortPriority]="3"
                  style="text-align: right"
                >
                  Right Rate
                </th>
                <th>Operators</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of headerTable.data; let index = index">
                <td
                  [nzChecked]="setOfCheckId.has(data.id)"
                  (nzCheckedChange)="onItemChecked(data.id, $event)"
                ></td>
                <td>{{ index + 1 }}</td>
                <td>{{ data.word }}</td>
                <td>
                  <div class="Phonetic_box">
                    @if (data.phonetic) {
                      <span>/{{ data.phonetic }}/</span>
                    }
                    <app-horn [word]="data.word"></app-horn>
                  </div>
                </td>
                <td style="text-align: right">
                  {{ data.created_timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}
                </td>
                <td style="text-align: right">
                  {{ data.right_count }}/{{ data.total_count }} = {{ data.right_rate }}%
                </td>
                <td>
                  <div class="flex_box">
                    <a href="javascript:;" class="operator_item" (click)="clickViewDetail(data)"
                      >View Details</a
                    >
                    <span
                      class="operator_item"
                      [class.mispronounce]="data.mispronounce"
                      nz-icon
                      [nzType]="'sp:shutup'"
                      (click)="updateMisPronounce(data)"
                    ></span>
                    <span
                      class="operator_item"
                      nz-icon
                      [nzType]="'delete'"
                      (click)="removeWord(data.id)"
                    ></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      }
      @if (!loading && !searchKey && dataSource.length === 0) {
        <app-empty
          emptyTips="Empty word list, please add words first!"
          (uploadedDone)="uploadedDoneHandler()"
        ></app-empty>
      }
    </div>
    <button
      nz-button
      nzShape="circle"
      nzSize="large"
      class="layout_fab4"
      (click)="scrollToPosition('TOP')"
    >
      <span nz-icon nzType="vertical-align-top" nzTheme="outline"></span>
    </button>
    <button
      nz-button
      nzShape="circle"
      nzSize="large"
      class="layout_fab3"
      (click)="scrollToPosition('BOTTOM')"
    >
      <span nz-icon nzType="vertical-align-bottom" nzTheme="outline"></span>
    </button>
  `,
  styleUrl: './governance.component.less',
  imports: [
    HornComponent,
    CommonModule,
    SidePanelDetailsComponent,
    EmptyComponent,
    AngularFireDatabaseModule,
    FormsModule,
    ZorroModule,
    ScrollControlDirective,
  ],
})
export class GovernanceComponent implements OnInit, OnDestroy {
  dataSource: WordsItem[] = [];
  loading = true;
  allChecked = false;
  setOfCheckId = new Set<number>();
  searchKey: string;
  wordType: WordType;
  searchKeySubject$ = new Subject<string>();
  wordTypeSubject$ = new Subject<WordType>();

  @ViewChild('scrollBar') private scrollableDiv!: ElementRef;

  sortFnByLetter = (a: WordsItem, b: WordsItem) => a.word.localeCompare(b.word);
  sortFnByRightRate = (a: WordsItem, b: WordsItem) =>
    parseFloat(a.right_rate) - parseFloat(b.right_rate);

  private destroy$ = new Subject<void>();
  private allDataFromDB: WordsItem[] = [];

  constructor(
    private db: DbService,
    private fileService: FileService,
    private store: Store,
    private drawer: NzDrawerService,
  ) {}

  ngOnInit(setStore?: boolean): void {
    this.db
      .getAllWordsFromIndexDB(setStore)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        console.log('res', res);
        // reverse order
        this.dataSource = res.reverse();
        this.allDataFromDB = res;
      });
    this.searchKeySubject$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(
        (searchKey) =>
          (this.dataSource = frontEndSearchWordsByKeyword(searchKey, this.allDataFromDB)),
      );
    this.wordTypeSubject$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((wordType) => {
        this.dataSource =
          wordType && wordType !== 'ALL'
            ? this.allDataFromDB.filter((item) => item.type === wordType)
            : this.allDataFromDB;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  uploadedDoneHandler(): void {
    this.searchKey = '';
    this.wordType = 'ALL';
    this.ngOnInit();
  }

  scrollToPosition(direction: 'TOP' | 'BOTTOM'): void {
    if (direction === 'TOP') {
      const element = this.scrollableDiv.nativeElement;
      element.scrollTop = 0;
    } else {
      const element = this.scrollableDiv.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshAllCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.dataSource.forEach((item) => {
      this.updateCheckedSet(item.id as number, checked);
    });
    this.refreshAllCheckedStatus();
  }

  clickViewDetail(currentWord: WordsItem): void {
    this.db.getWordItemFromIndexDBById(currentWord.id as number).subscribe((wordItem) => {
      this.drawer.create<SidePanelDetailsComponent, { wordItem: WordsItem }>({
        nzContent: SidePanelDetailsComponent,
        nzContentParams: { wordItem },
        nzWidth: '800px',
      });
    });
  }

  bulkRemoveWords(): void {
    if (this.setOfCheckId.size === 0) {
      return;
    }
    this.db.removeWordsFromIndexDB([...this.setOfCheckId]).subscribe(() => {
      this.ngOnInit(true);
      this.setOfCheckId.clear();
    });
  }

  removeWord(id: number): void {
    this.db.removeWordsFromIndexDB([id]).subscribe(() => {
      this.ngOnInit(true);
    });
  }

  pickUp(): void {
    if (this.setOfCheckId.size === 0) {
      return;
    }
    const pickUpWords = this.dataSource.filter((d) => this.setOfCheckId.has(d.id as number));
    this.store.dispatch(setWordsList({ words: pickUpWords }));
    this.setOfCheckId.clear();
  }

  updateMisPronounce(element: WordsItem): void {
    const mispronounce = element.mispronounce;
    element.mispronounce = !mispronounce;
    this.db.updateWordItemFromIndexDB(element, true).subscribe(() => {});
  }

  clickViewJsonSchema(): void {
    console.log(this.dataSource.map((d) => d.word).join('\n'));
    const _now = new Date();
    const currentDate = format(_now, 'yyyy_MM_dd');
    this.fileService.exportJSONFile(
      {
        settings: null,
        words: this.dataSource,
      },
      `speller_data_${currentDate}_${_now.getTime()}`,
    );
  }

  private refreshAllCheckedStatus(): void {
    this.allChecked = this.dataSource.every((item) => {
      return this.setOfCheckId.has(item.id as number);
    });
  }

  private updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckId.add(id);
    } else {
      this.setOfCheckId.delete(id);
    }
  }
}
