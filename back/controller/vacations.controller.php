<?php

error_reporting(0);

require_once('../config/conexion.php');
require_once('../model/vacations.model.php');

$Vacations = new Vacation();

switch ($_GET["op"]) {

    case 'insertar15dias':
        $user_id = isset($_POST["user_id"]) ? $_POST["user_id"] : null;

        // Verificar que todos los campos están presentes
        if ($user_id !== null) {
            $data = $Vacations->insertar15dias($user_id);
            echo json_encode($data);
        } else {
            // Mensajes de depuración para identificar el campo faltante
            $missing_fields = [];
            if ($user_id === null) $missing_fields[] = 'user_id';
            echo json_encode([
                "status" => "400",
                "message" => "Faltan campos obligatorios.",
                "missing_fields" => $missing_fields
            ]);
        }
        break;

    case 'solicitarVacaciones':
    $periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : null;
    $daysTaken = isset($_POST["daysTaken"]) ? $_POST["daysTaken"] : null;
    $start = isset($_POST["start"]) ? $_POST["start"] : null;
    $finish = isset($_POST["finish"]) ? $_POST["finish"] : null;
    $detail = isset($_POST["detail"]) ? $_POST["detail"] : null;
    $user_id = isset($_POST["user_id"]) ? $_POST["user_id"] : null;

    // Verificar que todos los campos están presentes
    if ($periodo !== null && $daysTaken !== null && $start !== null && $finish !== null && $detail !== null && $user_id !== null) {
        $data = $Vacations->solicitarVacaciones($periodo, $daysTaken, $start, $finish, $detail, $user_id);
        echo json_encode($data);
    } else {
        // Mensajes de depuración para identificar los campos faltantes
        $missing_fields = [];
        if ($periodo === null) $missing_fields[] = 'periodo';
        if ($daysTaken === null) $missing_fields[] = 'daysTaken';
        if ($start === null) $missing_fields[] = 'start';
        if ($finish === null) $missing_fields[] = 'finish';
        if ($detail === null) $missing_fields[] = 'detail';
        if ($user_id === null) $missing_fields[] = 'user_id';
        echo json_encode([
            "status" => "400",
            "message" => "Faltan campos obligatorios.",
            "missing_fields" => $missing_fields
        ]);
    }

    break;

}



