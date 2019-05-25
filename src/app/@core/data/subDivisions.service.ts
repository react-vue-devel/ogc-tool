import { LineItemsService } from './line-items.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Parse, ParseObject } from 'parse';
import { DivisionsService } from './divisions.service';

@Injectable({
    providedIn: 'root',
})

export class SubDivisionsService {

    public subDivisions: Array<any> = [];
    public observableSubDivisions: BehaviorSubject<any>;

    constructor(
        private divisionsService: DivisionsService,
        protected lineItemsService: LineItemsService,
    ) {
        this.observableSubDivisions = new BehaviorSubject<any[]>(this.subDivisions);
        this.fetchSubDivisions();
        this.divisionsService = divisionsService;
    }

    async fetchSubDivisions() {
        const SubDivision = Parse.Object.extend('SubDivision');
        const query = new Parse.Query(SubDivision);
        query.limit(1000);
        this.subDivisions = await query.find();
        this.observableSubDivisions.next(this.subDivisions);
    }

    public async update(subDivision?) {
        // console.log(subDivision);
    }

    public async add(subDivision?) {
        if (this.subDivisions.filter(subDiv =>
            (subDiv.attributes.name === subDivision.name)
            && subDiv.attributes.division.id  === subDivision.division).length) {
            alert('SubDivision: ' + subDivision.name + 'already exists under Division: ' + subDivision.division );
        } else {
            this.createSubDivision(subDivision.name, this.divisionsService.divisions.find(division =>
                subDivision.division === division.id));
        }
    }

    public getAllSubDivisions() {
        return this.subDivisions;
    }

    public getSubDivisions(divisionId) {
        return this.subDivisions.filter(value => value.attributes.division.id === divisionId);
    }

    public getAllLineItems(subDivisionId) {
        return this.lineItemsService.getLintItem().filter(value => value.attributes.subDivision.id === subDivisionId);
    }

    private async createSubDivision(name: String, division: ParseObject) {
        const SubDivision = Parse.Object.extend('SubDivision');
        const subDivision = new SubDivision();
        subDivision.set('name', name);
        subDivision.set('division', division);

        subDivision.setACL(new Parse.ACL(Parse.User.current()));
        await subDivision.save().then((savedSubDivision) => {
          this.subDivisions.push(savedSubDivision);
          this.observableSubDivisions.next(this.subDivisions);
        }, (error) => {
          alert('Failed to create new SubDivision, with error code: ' + error.message);
        });
    }

    public async deleteSubDivision(event: any) {
        let subDivision = event.data;
        if (confirm('Are You Sure You Want to Delete SubDivision: ' + subDivision.attributes.name + ' ?')) {
            await subDivision.destroy().then(() => {
                this.subDivisions = this.subDivisions.filter( (value) => value.id !== subDivision.id );
                this.observableSubDivisions.next(this.subDivisions);
            }, (error) => {
                alert('Failed to delete SubDivision: ' + subDivision.attributes.name +
                ', error message: ' + error.message);
            });
        }
    }

}
