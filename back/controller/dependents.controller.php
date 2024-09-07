<?php

error_reporting(0);

/*TODO: Requerimientos */
require_once('../config/sesiones.php');
require_once("../model/dependents.model.php");
require_once("../config/cors.php");

$Dependientes = new Dependent;

switch ($_GET["op"]) {

    case 'todos':
        $datos = $Dependientes->todos();
        echo json_encode($datos); // Mostrar directamente la respuesta
        break;

    case 'uno':
        $id = $_POST["id"];
        $datos = $Dependientes->uno($id);
        echo json_encode($datos); // Mostrar directamente la respuesta
        break;

    case 'insertar':
        $name = $_POST["name"] ?? null;
        $lastname = $_POST["lastname"] ?? null;
        $relation = $_POST["relation"] ?? null;
        $disability = $_POST["disability"] ?? 0;
        $birthday = $_POST["birthday"] ?? null;
        $status = true; // Predeterminado a activo
        $id_user = $_POST["id_user"] ?? null;

        // Insertar solo si todos los campos están presentes
        if ($name && $lastname && $relation && $birthday && $id_user) {
            $data = $Dependientes->insertar($name, $lastname, $relation, $disability, $birthday, $status, $id_user);
            echo json_encode($data); // Mostrar directamente la respuesta
        } else {
            echo json_encode(['error' => 'Todos los campos son requeridos']);
        }
        break;

    case 'actualizar':
        $id = $_POST["id"];
        $name = $_POST["name"];
        $lastname = $_POST["lastname"];
        $relation = $_POST["relation"];
        $disability = $_POST["disability"];
        $birthday = $_POST["birthday"];
        $id_user = $_POST["id_user"];

        if ($id) {
            $data = $Dependientes->actualizar($id, $name, $lastname, $relation, $disability, $birthday, $id_user);
            echo json_encode($data); // Mostrar directamente la respuesta
        } else {
            echo json_encode(['error' => 'ID is required']);
        }
        break;

    case 'eliminar':
        $id = $_POST["id"];
        $data = $Dependientes->cambiarEstado($id);
        echo json_encode($data); // Mostrar directamente la respuesta
        break;
}
