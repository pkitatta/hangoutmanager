import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import firebase from 'firebase';
import {FormControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public firestore: AngularFirestore,
    private auth: AuthService,
  ) {
  }

  async createHangout(hid: any, name: any): Promise<void> {

    // return this.firestore.doc(`hangouts/${id}`).set({
    //   id,
    //   name,
    //   gpsCords,
    // });

    const did = this.firestore.createId();
    await this.firestore.collection('hangouts').doc(did).set({
      hid,
      did,
      name,
      theme: false,
      services: [],
      drinkFoodBase: null,
      entryBase: null
    })
      .then((docRef) => {
        //
        const themeDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        // themeDay.forEach((day) => {
        //     this.firestore
        //         .collection('hangouts')
        //         .doc(did)
        //         .collection('theme')
        //         .doc(day)
        //         .set({
        //             description: null,
        //             start: null,
        //             end: null,
        //             entry: null,
        //             sample: null,
        //             photo: null,
        //         }, { merge: true });
        // });
        // tslint:disable-next-line:prefer-for-of
        // for (let i = 0; i < themeDay.length; i++) {
        //     this.firestore
        //         .collection('hangouts')
        //         .doc(did)
        //         .collection('theme')
        //         .doc(themeDay[i])
        //         .set({
        //             description: null,
        //             start: null,
        //             end: null,
        //             entry: null,
        //             sample: null,
        //             photo: null,
        //             count: 1
        //         }, { merge: true });
        // }
        let i = 0;
        for (const day of themeDay) {
          i++;
          this.firestore
            .collection('hangouts')
            .doc(did)
            .collection('theme')
            .doc(day)
            .set({
              day,
              description: null,
              start: null,
              end: null,
              entry: null,
              sample: null,
              photo: null,
              count: i
            }, {merge: true});
        }
        return 'Successful';
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  async editHangout(field: any, did: any): Promise<void> {
    //
    await this.firestore.collection('hangouts').doc(did).update(field)
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  getHangout(hid: any) {
    return this.firestore.collection('hangouts', ref => ref.where('hid', '==', hid));
  }

  getHangoutTheme(did: any): AngularFirestoreCollection<any> {
    return this.firestore.collection('hangouts').doc(did).collection('theme', ref => ref.orderBy('count', 'asc'));
  }

  setTheme(data: any, did: any, day: any): any {
    // return this.firestore
    //   .collection('hangouts')
    //   .doc(did)
    //   .collection('theme')
    //   .doc(day)
    //   .update(data).then(() => {
    //     if (!themeStatus) {
    //       return this.firestore
    //         .collection('hangouts')
    //         .doc(did)
    //         .update({theme: true});
    //     }
    //     return null;
    //   });

    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('theme')
      .doc(day)
      .update(data);
  }

  getServices(did: any): AngularFirestoreCollection<any> {
    return this.firestore.collection('hangouts').doc(did).collection('services');
  }

  addService(service: string, did: any) {
    if (service === 'bar') {
      return this.firestore
        .collection('hangouts')
        .doc(did)
        .update({
          barshelf: ['Beer', 'Champagne', 'Cocktail', 'Spirit', 'Wine'],
          services: firebase.firestore.FieldValue.arrayUnion(service)

        });
    } else {
      return this.firestore
        .collection('hangouts')
        .doc(did)
        .update({
          services: firebase.firestore.FieldValue.arrayUnion(service)

        });
    }
  }

  removeService(service: string, did: string) {
    return this.firestore
      .collection('hangouts').doc(did).update({
        services: firebase.firestore.FieldValue.arrayRemove(service)

      });
  }

  getHangoutMenu(did: string, section: string) {
    return this.firestore
      .collection<any>('hangouts')
      .doc(did)
      .collection(section);
  }

  async addMeal(data: any, did: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('restaurant')
      .add(data);
  }

  async editMeal(data: any, did: any, mdid: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('restaurant')
      .doc(mdid)
      .update(data);
  }

  getHangoutOrders(did: string, section: string) {
    // console.log('hangout id type: ' + did + ', section: ' + section);
    // return this.firestore
    //     .collectionGroup('orders', ref => ref.where('did', '==', did).where('section', '==', section).limit(20));

    return this.firestore
      .collection<any>('orders', ref => ref
        .where('hangoutId', '==', did)
        .where('section', '==', section)
        .where('confirmed', '==', true)
      );
  }
  getHangoutDeliveries(did: string, section: string) {
    // console.log('hangout id type: ' + did + ', section: ' + section);
    // return this.firestore
    //     .collectionGroup('orders', ref => ref.where('did', '==', did).where('section', '==', section).limit(20));

    return this.firestore
      .collection('orders', ref => ref
        .where('hangoutId', '==', did)
        .where('section', '==', section)
        .where('confirmed', '==', true)
        .where('settled', '==', false)
      );
  }

  async sendToDelivered(did: string, odid: string, order: any) {
    await this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        delivered: true,
        deliveryTime: Date.now().toString()
      });

    if (order.section === 'restaurant')
      return this.firestore
        .collection('customers')
        .doc(order.currentMomentId)
        .collection('groupMates')
        .doc(order.orderFor.uid)
        .update({
          mealAvatar: order.order[0].photoUrl,
          currentMeal: order.order[0].name
        });
    else
      return this.firestore
        .collection('customers')
        .doc(order.currentMomentId)
        .collection('groupMates')
        .doc(order.orderFor.uid)
        .update({
          drinkAvatar: order.order[0].photoUrl,
          currentDrink: order.order[0].name
        });
  }

  async sendToDeliveredOrders(did: string, odid: string) {
    return await this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        delivered: true,
        deliveryTime: Date.now().toString()
      });
  }

  async sendToEnroute(did: string, odid: string) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        enroute: true,
      });
  }

  async cancelOrder(did: any, odid: any) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        canceled: true,
        canceledTime: Date.now().toString(),
        canceledBy: 'hangout(' + this.auth.token.username + ')'
      });
  }

  async removeOrder(did: any, odid: any) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        section: 'deleted'
      });
  }

  getAllDrinks() {
    return this.firestore
      .collection('beverages');
  }

  getDrinkOptions(name: any) {
    return this.firestore
      .collection<any>('beverages')
      .doc(name)
      .collection('options')
      .valueChanges({ idField: 'odid' });
  }

  getHangoutDrinkOptions(mdid: any, did: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .collection('options')
      .valueChanges({ idField: 'odid' });
  }
  changeDrinkAvail(mdid: any, did: any, option: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .collection('options')
      .doc(option.odid)
      .update({available: !option.available});
  }

  async addDrink(drink: any, mdid: any, did: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .set(drink, {merge: true});
  }

  async addDrinkOpt(data: any, odid: any, did: any, mdid: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .collection('options')
      .doc(odid)
      .set(data, {merge: true});
  }

  editDrinkPrice(mdid: any, did: any, odid: any, price: FormControl | any | number | string | number | firebase.analytics.Currency) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .collection('options')
      .doc(odid)
      .update({price: +price});
  }

  async deleteDrinkOption(mdid: any, did: any, odid: any) {
    return this.firestore
      .collection('hangouts')
      .doc(did)
      .collection('bar')
      .doc(mdid)
      .collection('options')
      .doc(odid)
      .delete();
  }

  async settleOrder(did: any, odid: any, settlement: string) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        paymentMethod: settlement,
        settled: true,
        settledTime: Date.now().toString(),
        settledBy: 'hangout(' + this.auth.token.username + ')'
      });
  }

  async rejCash(did: any, odid: any) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        paymentMethod: '',
      });
  }

  async seenOrder(did: any, odid: any, status: any) {
    return this.firestore
      .collection('orders', ref => ref.where('hangoutId', '==', did))
      .doc(odid)
      .update({
        status: status,
      });
  }
}
