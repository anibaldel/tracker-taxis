import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController, LoadingController, NavController } from '@ionic/angular';
import { UsuarioService } from '../../servicios/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  constructor( public alertCtrl: AlertController,
               public loadingCtrl: LoadingController,
               public usuarioServ: UsuarioService,
               public navCtrl: NavController ) { }

  ngOnInit() {

    // this.slides.scrollbar();
    this.slides.lockSwipes(true);
    // this.slides.freeMode = false;
  }
  async mostrarInput() {

    const input = await this.alertCtrl.create({
      header: 'Ingrese el usuario',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'UserName'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: ( data ) => {
            console.log('Confirm Ok', data);
            this.verificarUsuario(data.username);
            // this.titulo = data.txtNombre;
          }
        }
      ]
    });

    await input.present();

  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario incorrecto',
      subHeader: 'Hable con el administrador o pruebe de nuevo',
      buttons: [
      {
        text: 'Aceptar',
        handler: (blah) => {
        }
      }
    ]
    });

    await alert.present();
  }

  async verificarUsuario( clave: string ) {
    this.loadingCtrl.create({
      message: 'Verificando',
      duration: 1000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        this.usuarioServ.verificaUsuario( clave )
            .then( existe => {
              if ( existe ) {
                this.slides.lockSwipes(false);
                this.slides.slideNext();
                this.slides.lockSwipes(true);
              } else {
                this.presentAlert();
              }
            });
      });
    });
  }

  ingresar() {

    this.navCtrl.navigateRoot( '/home');
  }

}
