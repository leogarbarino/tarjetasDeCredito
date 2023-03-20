import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent {

  constructor(private _tarjetaService: TarjetaService, private toast:ToastrService){

    this.listarTarjetas();
  }
  listaTarjetas:TarjetaCredito[]= [];

  listarTarjetas(){
      this._tarjetaService.listarTarjetas().subscribe(res=>{
        console.log(res);
        this.listaTarjetas= [];
        res.forEach((element:any) => {
          this.listaTarjetas.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          })
          console.log(element.payload.doc.id);
          console.log(element.payload.doc.data());
        });
        console.log(this.listaTarjetas);
      })
  }

  eliminarTarjeta(id:any){
    this._tarjetaService.eliminarTarjeta(id).then(()=>{
       this.toast.error("Tarjeta eliminada correctamente","Registro eliminado");
    }, error => {
      this.toast.error("Ops, ha ocurrido un error","Error");
      console.log(error);
    })
  }

  editarTarjeta(tarjeta: TarjetaCredito){
     this._tarjetaService.addTarjetaEdit(tarjeta);
  }

}
