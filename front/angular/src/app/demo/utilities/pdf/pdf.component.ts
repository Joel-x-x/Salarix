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
  ║          Reporte nóminas por periodo             ║
  ╚══════════════════════════════════════════════════╝*/
  nominasPeriodo(nominas: INomina[], start: string, finish: string) {
    const doc = new jsPDF();

    // ➤ Obtener totales
    let totalNominas = 0;
    let totalProvision = 0;
    let totalIngreso = 0;
    let totalEgesos = 0;
    let totalLiquid = 0;
    nominas.forEach(nomina => {
      totalNominas ++;
      totalProvision += nomina.totalProvision ?? 0;
      totalIngreso += nomina.totalIncome ?? 0;
      totalEgesos += nomina.totalEgress ?? 0;
      totalLiquid += nomina.totalLiquid ?? 0;
    });

    // ➤ Title
    const title = "Reporte Nóminas";
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(title, this.calcularXCentrado(title), 10);

    // ➤ Add background for title
    doc.setFillColor(238, 240, 242);
    doc.roundedRect(75 - 2, 10 - 6, 70, 10, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(title, this.calcularXCentrado(title), 10);

    // ➤ General information
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    let xLabel = 25;
    let xValue = 60;
    let yPos = 25; // Starting Y position for the content

    // ➤ Define a function to format text with bold labels and background
    const drawLabelValue = (label: string, value: string, xLabel: number, xValue: number) => {
      doc.setFont("Helvetica", "normal");
      doc.text(label, xLabel, yPos);
      doc.setFont("Helvetica", "normal");
      doc.text(value, xValue, yPos);
      yPos += 7; // Move to the next line
    };

    // ➤ Column 1
    drawLabelValue("Periodo:", start + " - " + finish, xLabel, xValue);
    drawLabelValue("Total nóminas:", totalNominas + '', xLabel, xValue);
    // ➤ Financial Information
    xLabel = 115;
    xValue = 150;
    yPos = 25;

    // ➤ Column 2
    drawLabelValue("Total en provisiones:", totalProvision + '', xLabel, xValue);
    drawLabelValue("Total de ingresos:", totalIngreso + '', xLabel, xValue);
    drawLabelValue("Total de egresos:", totalEgesos + '', xLabel, xValue);
    drawLabelValue("Total de Líquido:", totalLiquid + '', xLabel, xValue);

    // ➤ Separation line
    doc.setDrawColor(0, 0, 0); // Black color for line
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 185, yPos); // Draw horizontal line from x=20 to x=190
    yPos += 10; // Espacio adicional después de la línea de separación

  }

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

    // ➤ Add background for title
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
    let xLabel = 25;
    let xValue = 60;
    let yPos = 25; // Starting Y position for the content

    // Define a function to format text with bold labels and background
    const drawLabelValue = (label: string, value: string, xLabel: number, xValue: number) => {
      doc.setFont("Helvetica", "normal");
      doc.text(label, xLabel, yPos);
      doc.setFont("Helvetica", "normal");
      doc.text(value, xValue, yPos);
      yPos += 7; // Move to the next line
    };

    // ➤ Column 1
    drawLabelValue("Periodo:", nomina.periodName, xLabel, xValue);
    drawLabelValue("Fecha de Inicio:", nomina.start, xLabel, xValue);
    drawLabelValue("Fecha de Fin:", nomina.finish, xLabel, xValue);
    drawLabelValue("Empleado:", empleado.firstname + " " + empleado.lastname, xLabel, xValue);

    // ➤ Financial Information
    xLabel = 115;
    xValue = 150;
    yPos = 25;

    // ➤ Column 2
    drawLabelValue("Total Provisión:", nomina.totalProvision + '', xLabel, xValue);
    drawLabelValue("Total Ingresos:", nomina.totalIncome + '', xLabel, xValue);
    drawLabelValue("Total Egresos:", nomina.totalEgress + '', xLabel, xValue);
    drawLabelValue("Total Líquido:", nomina.totalLiquid + '', xLabel, xValue);

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
    yPos += 10;

    // ➤ Separation line
    doc.setDrawColor(0, 0, 0); // Black color for line
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 185, yPos); // Draw horizontal line from x=20 to x=190
    yPos += 10; // Espacio adicional después de la línea de separación

    // Page High
    const pageHeight = doc.internal.pageSize.height;

    // ➤ Check if the content exced the limit of the page
    const checkPageOverflow = (currentYPos: number) => {
      if (currentYPos >= pageHeight - 20) { // Dejando un margen de 20
        doc.addPage(); // Añadir nueva página
        yPos = 20; // Reiniciar posición yPos en la nueva página
      }
    };

    // ➤ Rubros
    detalles.forEach(detalle => {
      checkPageOverflow(yPos);
      // ➤ Title of rubro
      doc.setFillColor(238, 240, 242); // Light grey background for section title
      doc.roundedRect(20, yPos, 165, 10, 1, 1, 'F');
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(detalle.name, 30, yPos + 7); // Title of rubro
      // ➤ Type of rubro
      let tipoRubro = '';
      if (detalle.type == 0) {
        tipoRubro = '- Egreso';
      } else if (detalle.type == 1 && detalle.isBonus == 1) {
        tipoRubro = '+ Ingreso';
      } else if (detalle.type == 1 && detalle.isBonus == 0) {
        tipoRubro = '+ Provisión';
      }
      doc.text(tipoRubro, 145, yPos + 7);

      yPos += 15; // Espacio para el contenido del rubro

      // ➤ Rubro content
      // Texto para el título de la descripción
      doc.setFont("Helvetica", "normal");
      doc.text('Descripción:', 30, yPos);

      const maxWidth = 100;

      // Divide el texto largo en líneas según el ancho máximo
      const detalleLargo: string[] = doc.splitTextToSize(detalle.detail, maxWidth);

      // Imprime cada línea de texto ajustada al ancho, alineada a la derecha
      detalleLargo.forEach(line => {
        doc.text(line, 80, yPos);
        yPos += 3; // Ajusta el espacio entre líneas según sea necesario
      });

      yPos += 10;
      doc.setFont("Helvetica", "normal");
      doc.text('Monto', 30, yPos);
      doc.text((Math.round(detalle.monto * 100) / 100) + '', 160, yPos, { align: 'right' });
      yPos += 10;

    });

    yPos += 20;
    // Longitud de las líneas de firma
    const lineLength = 35;

    // ➤ Firma Conforme
    doc.setFontSize(10);
    doc.text("Firma Conforme:", 20, yPos - 5); // Título para la firma
    doc.line(20, yPos + 10, 30 + lineLength, yPos + 10); // Línea para la firma
    doc.text("C.I.: 1234567890", 20, yPos + 15); // Campo C.I. debajo de la línea

    // ➤ Firma Gerente
    doc.text("Firma Gerente:", 80, yPos - 5); // Título para la firma
    doc.line(80, yPos + 10, 90 + lineLength, yPos + 10); // Línea para la firma

    // ➤ Firma Contador
    doc.text("Firma Contador:", 140, yPos - 5); // Título para la firma
    doc.line(140, yPos + 10, 150 + lineLength, yPos + 10); // Línea para la firma

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

// ➤ Haber papa de aqui te falta agregar el power BI, el login, los usuarios con sus roles y la gestión de estos roles, y agregar el crud para formulas.
