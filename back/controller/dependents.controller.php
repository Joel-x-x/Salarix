<?php

error_reporting(0);

/*TODO: Requerimientos */

require_once('../config/sesiones.php');
require_once("../model/dependents.model.php");

$Dependientes = new Dependent;

switch ($_GET["op"]) {


    case 'todos':
        $datos = $Dependientes->todos();
        $response = json_decode($datos, true);

        if ($response['status'] == "200") {
            echo json_encode($response['data']);
        } else {
            echo json_encode([
                "status" => $response['status'],
                "message" => $response['message']
            ]);
        }
        break;

    case 'uno':
        $id = $_POST["id"];
        $datos = $Dependientes->uno($id);
        $response = json_decode($datos, true);

        if ($response['status'] == "200") {
            echo json_encode($response['data']);
        } else {
            echo json_encode([
                "status" => $response['status'],
                "message" => $response['message']
            ]);
        }
        break;

    case 'insertar':
        $name = isset($_POST["name"]) ? $_POST["name"] : null;
        $lastname = isset($_POST["lastname"]) ? $_POST["lastname"] : null;
        $relation = isset($_POST["relation"]) ? $_POST["relation"] : null;
        $disability = isset($_POST["disability"]) ? $_POST["disability"] : null;
        $birthday = isset($_POST["birthday"]) ? $_POST["birthday"] : null;
        $status = true; // default to active
        $id_user = isset($_POST["id_user"]) ? $_POST["id_user"] : null;

        // Verificar que todos los campos están presentes
        if ($name !== null && $lastname !== null && $relation !== null && $disability !== null && $birthday !== null && $id_user !== null) {
            $data = $Dependientes->insertar($name, $lastname, $relation, $disability, $birthday, $status, $id_user);
            echo json_encode($data);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($name === null) $missing_fields[] = 'name';
            if ($lastname === null) $missing_fields[] = 'lastname';
            if ($relation === null) $missing_fields[] = 'relation';
            if ($disability === null) $missing_fields[] = 'disability';
            if ($birthday === null) $missing_fields[] = 'birthday';
            if ($id_user === null) $missing_fields[] = 'id_user';

            echo json_encode([
                'error' => 'all fields are required',
                'missing_fields' => $missing_fields
            ]);
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
            echo json_encode($data);
        } else {
            echo json_encode(['error' => 'all fields are required']);
        }

        break;


    case 'eliminar':

        $id = $_POST["id"];
        $data = array();
        $data = $Dependientes->cambiarEstado($id);
        echo json_encode($data);
        break;
}
