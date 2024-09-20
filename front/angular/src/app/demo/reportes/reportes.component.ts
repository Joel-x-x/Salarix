import { ReporteService } from './../services/reporte.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PdfComponent } from '../utilities/pdf/pdf.component';
import { IReporteNomina, IReporteRegistro } from '../interfaces/IReporte';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reportForm1!: FormGroup;
  reportForm2!: FormGroup;
  reportForm3!: FormGroup;
  reportForm4!: FormGroup;

  constructor(private fb: FormBuilder, private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.reportForm1 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.reportForm2 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.reportForm3 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.reportForm4 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onSubmit(reportNumber: number): void {
    let formValues;

    switch (reportNumber) {
      case 1:
        formValues = this.reportForm1.value;
        const startDate = formValues.startDate;
        const endDate = formValues.endDate;

        this.reporteService.reporteNominas(startDate, endDate).subscribe(data => {
          const nominas: IReporteNomina[] = data;
          const pdf = new PdfComponent();
          pdf.nominasPeriodo(nominas, startDate, endDate);
        })
        break;
      case 2:
        formValues = this.reportForm2.value;

        const startDate2 = formValues.startDate;
        const endDate2 = formValues.endDate;

        this.reporteService.reporteRegistros(startDate2, endDate2).subscribe(data => {
          const registros: IReporteRegistro[] = data;
          const pdf = new PdfComponent();
          pdf.registroPeriodo(registros, startDate2, endDate2);
        })
        break;
      case 3:
        formValues = this.reportForm3.value;
        break;
      case 4:
        formValues = this.reportForm4.value;
        break;
      default:
        console.error('Número de reporte no válido');
        return;
    }

  }
}
