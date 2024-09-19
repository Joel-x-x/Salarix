import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { INomina } from '../../interfaces/INomina';
import { IDetalleNomina } from '../../interfaces/IDetalleNomina';
import { Empleado } from '../../interfaces/IEmpleado';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  constructor() { }

  ngOnInit() { }


  /*╔══════════════════════════════════════════════════╗
    ║                Reporte nómina                    ║
    ╚══════════════════════════════════════════════════╝*/
  nomina(nomina: INomina, detalles: IDetalleNomina[], empleado: Empleado): void {
    const doc = new jsPDF();

    // ➤ Title
    const title = "Reporte Nómina";
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(title, this.calcularXCentrado(title), 10);

    // Add background for title
    doc.setFillColor(238, 240, 242);
    doc.roundedRect(75 - 2, 10 - 6, 70, 10, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(title, this.calcularXCentrado(title), 10);
    // ➤ Employee Information
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    // doc.setFillColor(238, 240, 242);
    // doc.roundedRect(20, 25, 165, 65, 1, 1, 'F');
    doc.setTextColor(0, 0, 0);
    const xLabel = 25;
    const xValue = 60;
    let yPos = 25; // Starting Y position for the content

    // Define a function to format text with bold labels and background
    const drawLabelValue = (label: string, value: string, xLabel: number, xValue: number) => {
      doc.setFont("Helvetica", "normal");
      doc.text(label, xLabel, yPos);
      doc.setFont("Helvetica", "normal");
      doc.text(value, xValue, yPos);
      yPos += 10; // Move to the next line
    };

    drawLabelValue("Periodo:", nomina.periodName, xLabel, xValue);
    drawLabelValue("Fecha de Inicio:", nomina.start, xLabel, xValue);
    drawLabelValue("Fecha de Fin:", nomina.finish, xLabel, xValue);
    drawLabelValue("Empleado:", empleado.firstname + " " + empleado.lastname, xLabel, xValue);
    // ➤ Financial Information
    yPos = 25;
    drawLabelValue("Total Provisión:", nomina.totalProvision + '', 115, 150);
    drawLabelValue("Total Ingresos:", nomina.totalIncome + '', 115, 150);
    drawLabelValue("Total Egresos:", nomina.totalEgress + '', 115, 150);
    drawLabelValue("Total Líquido:", nomina.totalLiquid + '', 115, 150);

    // ➤ Separation line
    doc.setDrawColor(0, 0, 0); // Black color for line
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 185, yPos); // Draw horizontal line from x=20 to x=190
    yPos += 10; // Espacio adicional después de la línea de separación

    // ➤ Description
    doc.setTextColor(0, 0, 0); // Black text color
    doc.setFont("Helvetica", "bold");
    doc.text("Descripción:", 25, yPos);
    doc.setFont("Helvetica", "normal");
    doc.text(nomina.detail, 60, yPos);

    // ➤ Rubros
    yPos += 10;

    // Ejemplo de Rubros
    const rubros = [
      { titulo: "Ingresos",
        datos: [{
          descripcion: "Sueldo Base",
          monto: "1200.00"
        },
        {
          descripcion: "Horas Extras",
          monto: "300.00" }
        ]
      }
    ];

    rubros.forEach(rubro => {
      // Título del Rubro
      doc.setFillColor(238, 240, 242); // Light grey background for section title
      doc.roundedRect(20, yPos, 165, 10, 1, 1, 'F');
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(rubro.titulo, 30, yPos + 7); // Título del rubro

      yPos += 15; // Espacio para el contenido del rubro

      // Contenido del Rubro
      rubro.datos.forEach(dato => {
        doc.setFont("Helvetica", "normal");
        doc.text(dato.descripcion, 30, yPos);
        doc.text(dato.monto, 160, yPos, { align: 'right' }); // Monto alineado a la derecha
        yPos += 10; // Espacio entre cada dato del rubro
      });

    });

    // ➤ Save PDF
    doc.save("reporte_nomina.pdf");

  }

  // ➤ Calculo posicion central tomando en cuenta el texto

  calcularXCentrado(text: string): number {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(text);

    return (pageWidth - textWidth) / 2;
  }

}
