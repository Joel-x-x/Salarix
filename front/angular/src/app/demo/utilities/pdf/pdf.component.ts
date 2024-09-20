import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)
import { INomina } from '../../interfaces/INomina';
import { IDetalleNomina } from '../../interfaces/IDetalleNomina';
import { Empleado } from '../../interfaces/IEmpleado';
import { IReporteNomina, IReporteRegistro } from '../../interfaces/IReporte';

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
    ║          Reporte registros por periodo           ║
    ╚══════════════════════════════════════════════════╝*/
  registroPeriodo(registros: IReporteRegistro[], start: string, finish: string) {
    const doc = new jsPDF();

    // ➤ Obtener totales
    // let totalregistros: number = 0.0;
    let totalHorasOrdinarias: number = 0.0;
    let totalHorasExtraordinarias: number = 0.0;
    let totalHorasNocturnasExtraordinarias: number = 0.0;

    registros.forEach(registro => {
      // Asegúrate de que cada valor sea un número antes de sumar
      totalHorasOrdinarias += parseFloat(registro.ordinary_time != null ? registro.ordinary_time.toString() : '0') || 0;
      totalHorasExtraordinarias += parseFloat(registro.overtime != null ? registro.overtime.toString() : '0') || 0;
      totalHorasNocturnasExtraordinarias += parseFloat(registro.night_overtime != null ? registro.night_overtime.toString() : '0') || 0;
    });


    // ➤ Title
    const title = "Reporte Registros";
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
    // drawLabelValue("Total nóminas:", totalregistros + '', xLabel, xValue);
    drawLabelValue("Horas ordinarias:", totalHorasOrdinarias + '', xLabel, xValue);
    // ➤ Financial Information
    xLabel = 115;
    xValue = 150;
    yPos = 25;

    // ➤ Column 2
    drawLabelValue("Horas extraordinarias:", totalHorasExtraordinarias + '', xLabel, xValue);
    drawLabelValue("Horas nocturnas extraordinarias:", totalHorasNocturnasExtraordinarias + '', xLabel, 167);

    // ➤ Table
    // Encabezado de la tabla
    const tableColumn = [
      '#', 'Entrada', 'Salida',
      'Horas ordinarias', 'Horas extraordinarias', 'Horas noct. extraordinarias',
      'Empleado'
    ];

    // Datos de la tabla
    const tableRows: any[] = [];

    registros.forEach((registro, index) => {
      const registroData = [
        index + 1, // Número de fila
        registro.start, // Fecha de inicio
        registro.finish, // Fecha de fin
        registro.ordinary_time, // Total Provisión
        registro.overtime, // Total Ingresos
        registro.night_overtime, // Total Egresos
        `${registro.firstname} ${registro.lastname}`, // Empleado
      ];
      tableRows.push(registroData);
    });

    // Generar la tabla en el PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Posición de inicio de la tabla en el eje Y
      theme: 'striped', // Tema de la tabla
      headStyles: { fillColor: [64, 153, 255], textColor: [0, 0, 0] }, // Color del encabezado
      styles: { cellPadding: 3, fontSize: 10 }, // Estilos de la tabla
      margin: { top: 20 },
    });


    // ➤ Save PDF
    doc.save("registro_nomina.pdf");
  }

  /*╔══════════════════════════════════════════════════╗
    ║          Reporte nóminas por periodo             ║
    ╚══════════════════════════════════════════════════╝*/
  nominasPeriodo(nominas: IReporteNomina[], start: string, finish: string) {
    const doc = new jsPDF();
    // require('jspdf-autotable');

    console.log(nominas);

    // ➤ Obtener totales
    let totalNominas: number = 0.0;
    let totalProvision: number = 0.0;
    let totalIngreso: number = 0.0;
    let totalEgesos: number = 0.0;
    let totalLiquid: number = 0.0;

    nominas.forEach(nomina => {
      totalNominas++;

      // Asegúrate de que cada valor sea un número antes de sumar
      totalProvision += parseFloat(nomina.totalProvision.toString()) || 0;
      totalIngreso += parseFloat(nomina.totalIncome.toString()) || 0;
      totalEgesos += parseFloat(nomina.totalEgress.toString()) || 0;
      totalLiquid += parseFloat(nomina.totalLiquid.toString()) || 0;
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
    drawLabelValue("Total de ingresos:", totalIngreso + '', xLabel, xValue);
    // ➤ Financial Information
    xLabel = 115;
    xValue = 150;
    yPos = 25;

    // ➤ Column 2
    drawLabelValue("Total en provisiones:", totalProvision + '', xLabel, xValue);
    drawLabelValue("Total de egresos:", totalEgesos + '', xLabel, xValue);
    drawLabelValue("Total Líquido:", totalLiquid + '', xLabel, xValue);

    // ➤ Table
    // Encabezado de la tabla
    const tableColumn = [
      '#', 'Periodo', 'Fecha Inicio', 'Fecha Fin',
      'Empleado', 'Total Provisión', 'Total Ingresos',
      'Total Egresos', 'Total Líquido'
    ];

    // Datos de la tabla
    const tableRows: any[] = [];

    nominas.forEach((reporte, index) => {
      const reporteData = [
        index + 1, // Número de fila
        reporte.periodName, // Nombre del periodo
        reporte.start, // Fecha de inicio
        reporte.finish, // Fecha de fin
        `${reporte.firstname} ${reporte.lastname}`, // Empleado
        (Math.round(reporte.totalProvision * 100) / 100), // Total Provisión
        (Math.round(reporte.totalIncome * 100) / 100), // Total Ingresos
        (Math.round(reporte.totalEgress * 100) / 100), // Total Egresos
        (Math.round(reporte.totalLiquid * 100) / 100), // Total Líquido
      ];
      tableRows.push(reporteData);
    });

    // Generar la tabla en el PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50, // Posición de inicio de la tabla en el eje Y
      theme: 'striped', // Tema de la tabla
      headStyles: { fillColor: [64, 153, 255], textColor: [0, 0, 0] }, // Color del encabezado
      styles: { cellPadding: 3, fontSize: 10 }, // Estilos de la tabla
      margin: { top: 20 },
    });


    // ➤ Save PDF
    doc.save("reporte_nomina.pdf");
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
