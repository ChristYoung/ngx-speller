import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Subject, debounceTime, finalize, takeUntil } from 'rxjs';
import { DbService } from '../../services/DataBase/db.service';
import { setWordsList } from '../../store/words/words.actions';
import { WordsItem } from '../../types';
import { frontEndSearchWordsByKeyword } from '../../utils';
import { EmptyComponent } from '../../widgets/empty/empty.component';
import { HornComponent } from '../../widgets/horn/horn.component';
import { SidePanelDetailsComponent } from '../../widgets/side-panel-details/side-panel-details.component';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-governance',
  standalone: true,
  template: `
    <div class="page_container">
      <div class="title_row" nz-row [nzGutter]="24">
        <div nz-col [nzSpan]="6">
          <input
            nz-input
            placeholder="Search words"
            [(ngModel)]="searchKey"
            (ngModelChange)="searchKeySubject$.next($event)"
          />
        </div>
        <div nz-col [nzSpan]="18">
          <button nz-button nzType="primary">Sync to FireBase</button>
          <button
            nz-button
            nzType="default"
            (click)="pickUp()"
            [disabled]="setOfCheckId.size === 0"
          >
            Pick Up
          </button>
          <button
            nz-button
            nzType="default"
            (click)="bulkRemoveWords()"
            [disabled]="setOfCheckId.size === 0"
          >
            Bulk Remove
          </button>
        </div>
      </div>
      <div class="table_container">
        <nz-table
          #headerTable
          [nzData]="dataSource"
          [nzSize]="'small'"
          [nzFrontPagination]="false"
          [nzScroll]="{ y: '900px' }"
        >
          <thead>
            <tr>
              <th
                [nzWidth]="'40px'"
                [nzChecked]="allChecked"
                nzLabel="Select all"
                (nzCheckedChange)="onAllChecked($event)"
              ></th>
              <th [nzWidth]="'60px'">ID</th>
              <th [nzSortFn]="sortFnByLetter" [nzSortPriority]="1">Word</th>
              <th>Phonetic</th>
              <th
                [nzWidth]="'120px'"
                [nzSortFn]="sortFnByRightRate"
                [nzSortPriority]="3"
              >
                Right Rate
              </th>
              <th>Operators</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of headerTable.data">
              <td
                [nzChecked]="setOfCheckId.has(data.id)"
                (nzCheckedChange)="onItemChecked(data.id, $event)"
              ></td>
              <td>{{ data.id }}</td>
              <td>{{ data.word }}</td>
              <td>
                <div class="Phonetic_box">
                  <span>/{{ data.phonetic }}/</span>
                  <app-horn [word]="data.word"></app-horn>
                </div>
              </td>
              <td
                nz-tooltip
                nzTooltipTitle="{{ data.right_count }}/{{ data.total_count }}"
              >
                {{ data.right_rate }}%
              </td>
              <td>
                <div class="flex_box">
                  <a
                    href="javascript:;"
                    class="operator_item"
                    (click)="clickViewDetail(data)"
                    >View Details</a
                  >
                  <span
                    class="operator_item"
                    nz-icon
                    [nzType]="'heart'"
                    [nzTheme]="data.familiar ? 'twotone' : 'outline'"
                    (click)="updateFamiliarity(data)"
                    [nzTwotoneColor]="'#eb2f96'"
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
    </div>
    @if (!loading && !searchKey && dataSource.length === 0) {
    <app-empty emptyTips="Empty word list, please add words first!"></app-empty>
    }
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
  ],
})
export class GovernanceComponent implements OnInit, OnDestroy {
  dataSource: WordsItem[] = [];
  loading = true;
  allChecked = false;
  setOfCheckId = new Set<number>();
  openSideNav = false;
  viewDetailsWord: WordsItem;
  wordListFireBaseRef: any;
  searchKey: string;
  searchKeySubject$ = new Subject<string>();

  sortFnByLetter = (a: WordsItem, b: WordsItem) => a.word.localeCompare(b.word);
  sortFnByRightRate = (a: WordsItem, b: WordsItem) =>
    parseFloat(a.right_rate) - parseFloat(b.right_rate);

  private destroy$ = new Subject<void>();
  private allDataFromDB: WordsItem[] = [];

  constructor(
    private db: DbService,
    private store: Store, // private angularFireDataBase: AngularFireDatabase, // private realTimeDataBase: Database
    private drawer: NzDrawerService
  ) {}

  ngOnInit(setStore?: boolean): void {
    this.db
      .getAllWordsFromIndexDB(setStore)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.dataSource = res;
        this.allDataFromDB = res;
      });
    this.searchKeySubject$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((searchKey) => {
        this.dataSource = searchKey
          ? frontEndSearchWordsByKeyword(searchKey, this.allDataFromDB)
          : [...this.allDataFromDB];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  syncToFireBase(): void {
    // listVal(ref(this.angularFireDataBase, FIREBASE_WORD_DB_PATH)).subscribe(
    //   (res) => {
    //     console.log('uploadFireBase,res', res);
    //   }
    // );
    // set(ref(this.realTimeDataBase, FIREBASE_WORD_DB_PATH), [
    //   ...this.dataSource,
    // ]).then(() => console.log('更新成功'));
    // const qry = orderByKey();
    // console.log('qry', qry);
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
    this.viewDetailsWord = currentWord;
    this.drawer.create<SidePanelDetailsComponent, { wordItem: WordsItem }>({
      nzContent: SidePanelDetailsComponent,
      nzContentParams: { wordItem: this.viewDetailsWord },
      nzWidth: '800px',
    });
  }

  bulkRemoveWords(): void {
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
    const pickUpWords = this.dataSource.filter((d) =>
      this.setOfCheckId.has(d.id as number)
    );
    this.store.dispatch(setWordsList({ words: pickUpWords }));
    this.setOfCheckId.clear();
  }

  updateFamiliarity(element: WordsItem): void {
    const familiar = element.familiar;
    element.familiar = !familiar;
    this.db.updateWordItemFromIndexDB(element, true).subscribe(() => {});
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
