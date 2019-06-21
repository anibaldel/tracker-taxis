import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, NavController } from '@ionic/angular';
import { UbicacionService } from '../servicios/ubicacion/ubicacion.service';
import { UsuarioService } from '../servicios/usuario/usuario.service';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mapRef = null;

  user: any = {};

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private ubicacionServ: UbicacionService,
    public usuarioServ: UsuarioService
  ) {
      this.ubicacionServ.inicializarTaxista();
      this.ubicacionServ.taxista.valueChanges()
          .subscribe( data => {
              console.log( data );
              this.user = data;
          });
  }

  ngOnInit() {
    this.ubicacionServ.loadMap();
  }

  /* async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
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
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }*/

  salir() {

    this.usuarioServ.borrarUsuario();
    this.navCtrl.navigateRoot( '/');
  }

}