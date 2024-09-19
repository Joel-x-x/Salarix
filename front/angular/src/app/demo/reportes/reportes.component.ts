import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

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

  constructor(private fb: FormBuilder) {}

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
        break;
      case 2:
        formValues = this.reportForm2.value;
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

    const startDate = formValues.startDate;
    const endDate = formValues.endDate;

    console.log(`Reporte ${reportNumber} - Fecha de Inicio: ${startDate}, Fecha de Fin: ${endDate}`);
  }
}
