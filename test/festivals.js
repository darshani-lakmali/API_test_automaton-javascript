import { expect } from 'chai';
import supertest from  'supertest';
import qa from '../config/qa';

const request = supertest(qa.baseUrl);

describe('Basic Shakedown Test', () => {

    it('Verify API is responsive', () => {
        return request.get('fesivals').then((res) =>{
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
    });
});

describe('Functional Tests findings', () =>{
    it('GET /festivals', () => {
        return request.get('fesivals').then((res) =>{
            expect(res.body.data).to.not.be.empty;
        });
    });

    it('Verify calling existing festival name', () => {
        const url = 'fesivals?name=LOL-palooza';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(200);
            res.body.data.array.forEach(data => {
                expect(data.name).to.eq('LOL-palooza');
            });
        });
    });

    it('Verify calling existing band name', () => {
        const url = 'fesivals?bands.name=Winter Primates';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(200);
            res.body.data.array.forEach(data => {
                data.bands.array.forEach(nestedData => {                    
                    expect(nestedData.name).to.eq('Winter Primates');
                })
            });
        });
    });

    it('Verify calling existing band record label', () => {
        const url = 'fesivals?bands.recordLabel=Fourth Woman Records';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(200);
            res.body.data.array.forEach(data => {
                data.bands.array.forEach(nestedData => {                    
                    expect(nestedData.recordLabel).to.eq('Fourth Woman Records');
                })
            });
        });
    });

    it('GET/festivals with a combination of existing festival details', () => {
        const url = 'fesivals?name=LOL-palooza&bands.name=Winter Primates&bands.recordLabel=Fourth Woman Records';
        return request.get(url).then((res) =>{
            expect(res.body.data).to.not.be.empty;
            res.body.data.array.forEach(data => {
                expect(data.name).to.eq('LOL-palooza');
                data.bands.array.forEach(nestedData => {  
                    expect(nestedData.name).to.eq('Winter Primates');                  
                    expect(nestedData.recordLabel).to.eq('Fourth Woman Records');
                })
            });
        });
    });

    it('Verify calling non-existant festival name', () => {
        const url = 'fesivals?name=xyz';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(404);
        });
    });

    it('Verify calling non-existant band name', () => {
        const url = 'fesivals?bands.name=xyz';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(404);
        });
    });

    it('Verify calling non-existant band record label', () => {
        const url = 'fesivals?bands.recordLabel=xyz';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(404);
        });
    });

    it('Verify calling a combination of non-existant festival details', () => {
        const url = 'fesivals?name=xyz&bands.name=xyz&bands.recordLabel=xyz';
        return request.get(url).then((res) =>{
            expect(res.status).to.equal(404);
        });
    });
});


