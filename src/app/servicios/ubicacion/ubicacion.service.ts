import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UsuarioService } from '../usuario/usuario.service';
import { LoadingController } from '@ionic/angular';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  taxista: AngularFirestoreDocument<any>;
  mapRef = null;

  constructor( private afDB: AngularFirestore,
               private geolocation: Geolocation,
               public usuarioServ: UsuarioService,
               public loadingCtrl: LoadingController) {

    // this.taxista = this.afDB.doc(`/usuarios/${usuarioServ.clave}`);

  }
  inicializarTaxista() {
    this.taxista = this.afDB.doc(`/usuarios/${ this.usuarioServ.clave }`);
  }


  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 16
    });
    google.maps.event
    .addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      this.addMaker(myLatLng.lat, myLatLng.lng);
    });
  }

  private addMaker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      title: 'Hello World!'
    });
  }

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    this.taxista.update({
      lat: rta.coords.latitude,
      lng: rta.coords.longitude,
      clave: this.usuarioServ.clave
    });
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }
}
