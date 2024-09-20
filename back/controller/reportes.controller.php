<?php
error_reporting(0);

/* Requerimientos */
require_once("../model/reportes.model.php");
require_once("../config/cors.php");

$Reporte = new Reporte();

switch ($_GET["op"]) {
    case 'nominas':
        $start = $_POST['start'];
        $finish = $_POST['finish'];
        
        // Llamada a la función para obtener todos los registros
        $datos = $Reporte->reporteNominas($start, $finish);

        // Convertir los datos a formato JSON y enviar la respuesta
        echo json_encode($datos);
        break;
    case 'registros':
        $start = $_POST['start'];
        $finish = $_POST['finish'];
        
        // Llamada a la función para obtener todos los registros
        $datos = $Reporte->reporteRegistros($start, $finish);

        // Convertir los datos a formato JSON y enviar la respuesta
        echo json_encode($datos);
        break;
    default:
        echo json_encode([
            "status" => "404", // 404 Not Found
            "message" => 'URL no encontrada.',
            "data" => null,
        ]);
        break;
}
