<?php

error_reporting(0);

/* TODO: Requerimientos */
require_once('../config/conexion.php');
require_once('../model/departments.model.php');
require_once("../config/cors.php");

$Departamentos = new Department;

switch ($_GET["op"]) {

    case 'todos':
        $response = $Departamentos->todos();

        if ($response['status'] == "200") {
            echo json_encode($response);
        } else {
            echo json_encode([
                "status" => $response['status'],
                "message" => $response['message'],
                "data" => $response['data'],
            ]);
        }
        break;

    case 'uno':
        $id = $_POST["id"];
        $response = $Departamentos->uno($id);

        if ($response['status'] == "200") {
            echo json_encode($response);
        } else {
            echo json_encode([
                "status" => $response['status'],
                "message" => $response['message'],
                "data" => $response['data'],
            ]);
        }
        break;

    case 'insertar':
        $name = isset($_POST["name"]) ? $_POST["name"] : null;
        $description = isset($_POST["description"]) ? $_POST["description"] : null;

        // Verificar que todos los campos están presentes
        if ($name !== null && $description !== null) {
            $response = $Departamentos->insertar($name, $description);
            echo json_encode($response);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($name === null) $missing_fields[] = 'name';
            if ($description === null) $missing_fields[] = 'description';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "data" => [
                    "missing_fields" => $missing_fields
                ],
            ]);
        }
        break;

    case 'actualizar':
        $id = isset($_POST["id"]) ? $_POST["id"] : null;
        $name = isset($_POST["name"]) ? $_POST["name"] : null;
        $description = isset($_POST["description"]) ? $_POST["description"] : null;

        // Verificar que todos los campos están presentes
        if ($id !== null && $name !== null && $description !== null) {
            $response = $Departamentos->actualizar($id, $name, $description);
            echo json_encode($response);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($id === null) $missing_fields[] = 'id';
            if ($name === null) $missing_fields[] = 'name';
            if ($description === null) $missing_fields[] = 'description';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "data" => [
                    "missing_fields" => $missing_fields
                ],
            ]);
        }
        break;

    case 'eliminar':
        $id = isset($_POST["id"]) ? $_POST["id"] : null;

        // Verificar que el campo ID está presente
        if ($id !== null) {
            $response = $Departamentos->eliminar($id);
            echo json_encode($response);
        } else {
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "data" => [
                    "missing_fields" => ['id']
                ],
            ]);
        }
        break;
}
?>
