<?php
error_reporting(0);

/*TODO: Requerimientos */
require_once("../model/detail_nomina.model.php");
require_once("../config/cors.php");

$DetailNomina = new DetailNomina();

switch ($_GET["op"]) {
        /*TODO: Procedimiento para listar todos los registros de una nómina específica */
    case 'todos':
        $nomina_id = $_POST["nomina_id"];

        if ($nomina_id) {
            $datos = $DetailNomina->todos($nomina_id);

            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El id de la nómina es requerido."
            ]);
        }
        break;

        /*TODO: Procedimiento para listar un registro */
    case 'uno':
        $id = $_POST["id"];
        $datos = $DetailNomina->uno($id);

        echo json_encode($datos);
        break;

    case 'insertar':
        $name = $_POST["name"];
        $detail = $_POST["detail"];
        $type = $_POST["type"];
        $monto = $_POST["monto"];
        $isBonus = $_POST["isBonus"];
        $nomina_id = $_POST["nomina_id"];

        if ($name && $type !== null && $monto && $nomina_id) {
            $data = $DetailNomina->insertar($name, $detail, $type, $monto, $isBonus, $nomina_id);
            echo json_encode($data);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "Todos los campos son requeridos."
            ]);
        }
        break;

        /*TODO: Procedimiento para actualizar */
    case 'actualizar':
        $id = $_POST["id"];
        $name = $_POST["name"];
        $detail = $_POST["detail"];
        $type = $_POST["type"];
        $monto = $_POST["monto"];
        $isBonus = $_POST["isBonus"];
        $nomina_id = $_POST["nomina_id"];

        if ($id) {
            $datos = $DetailNomina->actualizar($id, $name, $detail, $type, $monto, $isBonus, $nomina_id);
            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El id es requerido.",
                "data" => null
            ]);
        }
        break;

        /*TODO: Procedimiento para eliminar un registro */
    case 'eliminar':
        $id = $_POST["id"];

        if ($id) {
            $datos = $DetailNomina->eliminar($id);
            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El id es requerido para eliminar.",
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
