<?php
require('../libs/fpdf.php');

class PDF extends FPDF
{
    // Cabecera de página
    function Header()
    {
        // Logo
        // $this->Image('logo.png',10,8,33); // Si tienes un logo
        // Arial bold 15
        $this->SetFont('Arial', 'B', 15);
        // Movernos a la derecha
        $this->Cell(80);
        // Título
        $this->Cell(30, 10, 'Factura', 0, 1, 'C');
        // Salto de línea
        $this->Ln(10);
    }

    // Pie de página
    function Footer()
    {
        // Posición: a 1,5 cm del final
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial', 'I', 8);
        // Número de página
        $this->Cell(0, 10, 'Pagina ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }

    // Tabla de productos
    function ProductosTable($header, $data)
    {
        // Cabecera
        $this->SetFont('Arial', 'B', 12);
        foreach ($header as $col) {
            $this->Cell(35, 7, $col, 1);
        }
        $this->Ln();

        // Datos
        $this->SetFont('Arial', '', 12);
        foreach ($data as $row) {
            foreach ($row as $col) {
                $this->Cell(35, 7, $col, 1);
            }
            $this->Ln();
        }
    }
}

// Crear PDF
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

// Datos simulados (productos seleccionados)
$productos = [
    ['Descripcion' => 'Producto 1', 'Cantidad' => 2, 'Precio' => 1000, 'Subtotal' => 2000, 'IVA' => 12, 'Total' => 2000],
    ['Descripcion' => 'Producto 2', 'Cantidad' => 2, 'Precio' => 1000, 'Subtotal' => 2000, 'IVA' => 12, 'Total' => 2000],
    ['Descripcion' => 'Producto 3', 'Cantidad' => 2, 'Precio' => 1000, 'Subtotal' => 2000, 'IVA' => 12, 'Total' => 2000]
];

// Cálculo de totales (esto depende de la lógica de tu aplicación)
$sub_total = 6000;
$valor_iva = 12;
$total_iva = ($sub_total * $valor_iva) / 100;
$total_a_pagar = $sub_total + $total_iva;

// Detalles de la factura
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, 'Detalles de la Factura:', 0, 1);
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, 'Fecha: ' . date('Y-m-d'), 0, 1);
$pdf->Cell(0, 10, 'Sub-total: $' . number_format($sub_total, 2), 0, 1);
$pdf->Cell(0, 10, 'IVA (' . $valor_iva . '%): $' . number_format($total_iva, 2), 0, 1);
$pdf->Cell(0, 10, 'Total a Pagar: $' . number_format($total_a_pagar, 2), 0, 1);
$pdf->Ln(10);

// Encabezados de la tabla
$header = ['Descripcion', 'Cantidad', 'Precio', 'Subtotal', 'IVA', 'Total'];

// Llamar a la función para crear la tabla
$pdf->ProductosTable($header, $productos);

// Guardar el archivo PDF
$pdf->Output('I', 'factura.pdf');
?>
