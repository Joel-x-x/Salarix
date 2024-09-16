<?php
error_reporting(0);

/* Requerimientos */
require_once("../model/nominas.model.php");
require_once("../config/cors.php");

$Nominas = new Nomina();

switch ($_GET["op"]) {
        /* Procedimiento para listar todos los registros */
    case 'todos':
        // Llamada a la función para obtener todos los registros
        $datos = $Nominas->todos();

        // Convertir los datos a formato JSON y enviar la respuesta
        echo json_encode($datos);
        break;

        /* Procedimiento para listar un registro */
    case 'uno':
        $id = $_POST["id"] ?? null;
        if ($id) {
            $datos = $Nominas->uno($id);

            // Convertir los datos a formato JSON
            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El ID es requerido.",
                "data" => null
            ]);
        }
        break;

        /* Procedimiento para insertar */
    case 'insertar':
        $periodName = $_POST["periodName"] ?? null;
        $start = $_POST["start"] ?? null;
        $finish = $_POST["finish"] ?? null;
        $detail = $_POST["detail"] ?? null;

        if ($periodName && $start && $finish) {
            $data = $Nominas->insertar($periodName, $start, $finish, $detail);
            echo json_encode($data);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "Todos los campos requeridos son necesarios."
            ]);
        }
        break;

        /* Procedimiento para actualizar */
    case 'actualizar':
        $id = $_POST["id"] ?? null;
        $periodName = $_POST["periodName"] ?? null;
        $start = $_POST["start"] ?? null;
        $finish = $_POST["finish"] ?? null;
        $detail = $_POST["detail"] ?? null;
        $totalProvision = $_POST["totalProvision"] ?? null;
        $totalIncome = $_POST["totalIncome"] ?? null;
        $totalEgress = $_POST["totalEgress"] ?? null;
        $totalLiquid = $_POST["totalLiquid"] ?? null;
        $user_id = $_POST["user_id"] ?? null;

        if ($id) {
            $datos = $Nominas->actualizar($id, $periodName, $start, $finish, $detail, $totalProvision, $totalIncome, $totalEgress, $totalLiquid, $user_id);
            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El ID es requerido.",
                "data" => null
            ]);
        }
        break;


    default:
        echo json_encode([
            "status" => "404", // 404 Not Found
            "message" => 'URL no encontrada.',
            "data" => null,
        ]);
        break;
}
