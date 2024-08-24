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
        $name = $_POST["name"];
        $lastname = $_POST["lastname"];
        $relation = $_POST["relation"];
        $disability = $_POST["disability"];
        $birthday = $_POST["birthday"];
        $status = true; // default to active
        $id_user = $_POST["id_user"];

        if ($name && $lastname && $relation && $disability && $birthday && $id_user) {
            $data = $Dependientes->insertar($name, $lastname, $relation, $disability, $birthday, $status, $id_user);
            echo json_encode($data);
        } else {
            echo json_encode(['error' => 'all fields are required']);
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
