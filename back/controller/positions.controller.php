<?php
error_reporting(0);
require_once("../config/cors.php");
require_once("../model/positions.model.php");

$position = new Position;

switch ($_GET["op"]) {
    case 'insertar':
        $name = $_POST["name"] ?? null;
        $description = $_POST["description"] ?? null;

        if ($name) {
            $datos = $position->insertar($name, $description);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'actualizar':
        $id = $_POST["id"] ?? null;
        $name = $_POST["name"] ?? null;
        $description = $_POST["description"] ?? null;

        if ($id && $name) {
            $datos = $position->actualizar($id, $name, $description);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'eliminar':
        $id = $_POST["id"] ?? null;

        if ($id) {
            $datos = $position->eliminar($id);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'uno':
        $id = $_GET["id"] ?? null;

        if ($id) {
            $datos = $position->uno($id);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'todos':
        $datos = $position->todos();
        echo json_encode($datos);
        break;
}
?>
