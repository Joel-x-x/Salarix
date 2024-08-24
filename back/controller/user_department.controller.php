<?php

//error_reporting(0);

require_once('../config/conexion.php');
require_once('../model/user_departments.model.php');

$UserDepartments = new UserDepartment;

switch ($_GET["op"]) {

    case 'insertar':
        $user_id = isset($_POST["user_id"]) ? $_POST["user_id"] : null;
        $department_id = isset($_POST["department_id"]) ? $_POST["department_id"] : null;

        // Verificar que todos los campos están presentes
        if ($user_id !== null && $department_id !== null) {
            $data = $UserDepartments->insertar($user_id, $department_id);
            echo json_encode($data);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($user_id === null) $missing_fields[] = 'user_id';
            if ($department_id === null) $missing_fields[] = 'department_id';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "missing_fields" => $missing_fields
            ]);
        }
        break;

    case 'eliminar':
        $user_id = isset($_POST["user_id"]) ? $_POST["user_id"] : null;
        $department_id = isset($_POST["department_id"]) ? $_POST["department_id"] : null;

        // Verificar que todos los campos están presentes
        if ($user_id !== null && $department_id !== null) {
            $data = $UserDepartments->eliminarRelacion($user_id, $department_id);
            echo json_encode($data);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($user_id === null) $missing_fields[] = 'user_id';
            if ($department_id === null) $missing_fields[] = 'department_id';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "missing_fields" => $missing_fields
            ]);
        }
        break;

    default:
        echo json_encode([
            "status" => "404",
            "message" => "Operación no encontrada."
        ]);
        break;

    case 'listarUsuariosPorDepartamento':
        $department_id = isset($_POST["department_id"]) ? $_POST["department_id"] : null;

        // Verificar que todos los campos están presentes
        if ($department_id !== null) {
            $data = $UserDepartments->listarUsuariosPorDepartamento($department_id);
            echo json_encode($data);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($department_id === null) $missing_fields[] = 'department_id';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "missing_fields" => $missing_fields
            ]);
        }
        break;
}
