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
}


?>