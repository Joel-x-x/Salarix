<?php
error_reporting(0);

/* TODO: Requrimientos */
require_once '../model/registers.model.php';

$Registros = new Register;

switch($_GET["op"]) {
  /* TODO: Procedimiento para registrar a un usuario */
  case 'primer-registro':

    $userId = $_POST["userId"];

    // Validar que no este vacio
    if(empty($userId)) {
        echo json_encode([
          "status" => "404", // 404 Bad request
          "message" => "El userId es requerido.",
      ]);

      return;
    }
    $datos = $Registros->primerRegistro($userId);

    echo json_encode($datos);
  break;

  case 'listar-registros':

    $userId = $_POST["user_id"];

    // Validar que no este vacio
    if(empty($userId)) {
        echo json_encode([
          "status" => "404", // 404 Bad request
          "message" => "El userId es requerido.",
      ]);

      return;
    }
    $datos = $Registros->listarRegistrosPorUsuario($userId);

    echo json_encode($datos);
  break;

  case 'insertarRegistroSalida':

    $codigoEmpleado = $_POST["codigoEmpleado"];

    // Validar que no este vacio
    if(empty($codigoEmpleado)) {
        echo json_encode([
          "status" => "404", // 404 Bad request
          "message" => "El código de empleado es requerido.",
      ]);

      return;
    }

    $datos = $Registros->insertarRegistroSalida($codigoEmpleado);

    echo json_encode($datos);
    
  break;

  case 'actualizarRegistro':

    $id = $_POST["id"];
    $start = $_POST["start"];
    $finish = $_POST["finish"];
    $ordinary_time = $_POST["ordinary_time"];
    $night_overtime = $_POST["night_overtime"];

    // Validar que no este vacio
    if(empty($id)) {
        echo json_encode([
          "status" => "404", // 404 Bad request
          "message" => "El id es requerido.",
      ]);

      return;
    }

    $datos = $Registros->actualizarRegistro($id, $start, $finish, $ordinary_time, $overtime, $night_overtime);

    echo json_encode($datos);


}


?>