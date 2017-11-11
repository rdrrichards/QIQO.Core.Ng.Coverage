import { } from 'jasmine';
import { FetchDataComponent } from './fetchdata.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Http, ConnectionBackend } from '@angular/http';
import { HttpModule } from '@angular/http';

let fixture: ComponentFixture<FetchDataComponent>;

describe('FetchData component', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            imports: [ HttpModule ],
            declarations: [FetchDataComponent],
            providers: [ Http, { provide: 'BASE_URL', useValue: 'http://localhost:13831/'}, ConnectionBackend ] 
        });
        fixture = TestBed.createComponent(FetchDataComponent);
        fixture.detectChanges();
    });

    it('should create', async(() => {
        expect(fixture).toBeTruthy();
    }));

    // it('should display a title', async(() => {
    //     const titleText = fixture.nativeElement.querySelector('h1').textContent;
    //     expect(titleText).toEqual('Counter');
    // }));

    // it('should start with count 0, then increments by 1 when clicked', async(() => {
    //     const countElement = fixture.nativeElement.querySelector('strong');
    //     expect(countElement.textContent).toEqual('0');

    //     const incrementButton = fixture.nativeElement.querySelector('button');
    //     incrementButton.click();
    //     fixture.detectChanges();
    //     expect(countElement.textContent).toEqual('1');
    // }));
});
