import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
const params= new HttpParams({
  fromObject:{
    action:'opensearch',
    Format:'json'
  }
})
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  currentPage:number=1;
  @ViewChild ('movieSearchInput',{static:true})
  movieSearchInput!:ElementRef;
  isSearching !:boolean;
  content:any = [];
  term:any
  totalPages:number=0;
  nextPageURL:any;
  constructor( private http : HttpClient) { 
    this.isSearching=false;
    this.content=[];
  }

  ngOnInit():void {
    this.getdataFromAPI(this.currentPage, this.term);
    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
      debounceTime(250),
      map((event:any)=>{
        return event.target.value
      })
      ,filter(res => res.length > 3)
      ,distinctUntilChanged()
      ,switchMap(()=>{
        let url = `https://demo.credy.in/api/v1/maya/movies/?page=${this.currentPage}`;
   return this.http.get(url )
      })

    ).subscribe({
      next: (text:any)=>{
        console.log(text)
      }
    })
  }
  getdataFromAPI(currentPage : number,term :string):any{
    if (term === '') {
      return of([]);
    }
    let limit:number=5;
    let url = `https://demo.credy.in/api/v1/maya/movies/?page=${this.currentPage}`;
    this.http.get(url ).subscribe((data:any)=>{
      this.content.push(...data.results);
      this.totalPages = data.count;
      this.nextPageURL=data.next;
      console.log("content", this.content)
    },(err)=>{
      console.error(err);
    })
  }
  refresh(){
    this.getdataFromAPI(this.currentPage, this.term)
  }
  onScroll(event:any){
    let scrollHeight = event.target.scrollHeight;
    let scrollTop = event.target.scrollTop;
    let clientHeight = event.target.clientHeight;
    console.log(event)
    console.log("scrollHeight ",scrollHeight);
    console.log("scrollTop ",scrollTop);
    console.log("clientHeight ",clientHeight);

    let scrollPosition = scrollHeight - (scrollTop + clientHeight);
    if(( scrollPosition < 1)  && this.totalPages > this.currentPage){
      this.currentPage++;
      this.getdataFromAPI(this.currentPage, this.term);
    }
  }
getImageSource(){
  let imageURL=`https://ui-avatars.com/api/?name=${this.content.title}`
  return imageURL
}
}


