import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent {
  forms: FormGroup;
  loading: boolean = false;
  titulo= "Agregar Tarjeta";
  id: string | undefined;

  constructor(
    private fb: FormBuilder,
    private _tarjetaService: TarjetaService,
    private toastr: ToastrService
  ) {
    this.forms = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      fechaExpiracion: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(){
    this._tarjetaService.getTarjeta().subscribe(res=>{
      this.titulo= "Editar Tarjeta";
      this.id= res.id;
      this.forms.patchValue({
        titular: res.titular,
        numeroTarjeta: res.numeroDeTarjeta,
        fechaExpiracion: res.fechaExpiracion,
        cvv: res.cvv
      })
      console.log(res);
    })
  }

  guardarTarjeta(){
    if(this.id === undefined){
       // crea la tarjeta
       this.crearTarjeta();

    }else{
       // edita la tarjeta
       this.editarTarjeta(this.id);

    }
  }

  crearTarjeta() {
   // console.log(this.forms);

    const DATOSTARJETA: any= {
      titular: this.forms.value.titular,
      numeroDeTarjeta: this.forms.value.numeroTarjeta,
      fechaExpiracion: this.forms.value.fechaExpiracion,
      cvv: this.forms.value.cvv,
      fechaActualizacion: new Date()
      
    };
    /*  console.log(DATOSTARJETA); */
    // Ponemos la variable loading a true para que aparezca el spinner
    this.loading = true;
    this._tarjetaService.guardarTarjeta(DATOSTARJETA).then(
      () => {
        this.loading = false;
        this.toastr.success(
          'Tarjeta registrada exitosamente',
          'Tarjeta Registrada'
        );
        this.forms.reset();
      },
      (error) => {
        this.loading= false;
        this.toastr.error(
          'La tarjeta no puede registrarse, intente nuevamente',
          'Error'
        );
      }
    );
  }

  editarTarjeta(id: string){
    const DATOSTARJETA: any= {
      titular: this.forms.value.titular,
      numeroDeTarjeta: this.forms.value.numeroTarjeta,
      fechaExpiracion: this.forms.value.fechaExpiracion,
      cvv: this.forms.value.cvv,
      fechaActualizacion: new Date()
      
    }
        this.loading= true;
        this._tarjetaService.editarTarjeta(id, DATOSTARJETA).then(()=>{
        this.loading= false;
        this.toastr.info("El registro fue actualizado con éxito", "Tarjeta actualizada");
        this.forms.reset();
        this.titulo= "Agregar Tarjeta";
        this.id= undefined;
    }, error =>{
        this.toastr.error("Error en la actualización", "Error");
    })
  }
}
