<?php
error_reporting(0);

/* TODO: Requerimientos */
require_once '../model/registers.model.php';
require_once("../config/cors.php");

$Registros = new Register;

switch($_GET["op"]) {
  /* TODO: Procedimiento para registrar a un usuario */
  case 'registro-entrada':
    $codeEmployee = $_POST["codeEmployee"];

    // Validar que no esté vacío
    if (empty($codeEmployee)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "El codeEmployee es requerido.",
        ]);
        return;
    }
    $datos = $Registros->primerRegistro($codeEmployee);

    echo json_encode($datos);
    break;

  case 'listar-registros-empleado':
    $codeEmployee = $_POST["codeEmployee"];

    // Validar que no esté vacío
    if (empty($codeEmployee)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "El codeEmployee es requerido.",
        ]);
        return;
    }
    $datos = $Registros->listarRegistrosPorEmpleado($codeEmployee);

    echo json_encode($datos);
    break;

  case 'listar-registros-fechas':
    $startDate = $_POST["startDate"];
    $finishDate = $_POST["finishDate"];

    // Validar que no estén vacías
    if (empty($startDate) || empty($finishDate)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "Las fechas son requeridas.",
        ]);
        return;
    }
    $datos = $Registros->listarRegistrosPorFechas($startDate, $finishDate);

    echo json_encode($datos);
    break;

  case 'listar-registros-fechas-empleado':
    $codeEmployee = $_POST["codeEmployee"];
    $startDate = $_POST["startDate"];
    $finishDate = $_POST["finishDate"];

    // Validar que no estén vacíos
    if (empty($codeEmployee) || empty($startDate) || empty($finishDate)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "El codeEmployee y las fechas son requeridos.",
        ]);
        return;
    }
    $datos = $Registros->listarRegistrosPorEmpleadoFechas($codeEmployee, $startDate, $finishDate);

    echo json_encode($datos);
    break;

  case 'registro-salida':
    $codeEmployee = $_POST["codeEmployee"];

    // Validar que no esté vacío
    if (empty($codeEmployee)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "El código de empleado es requerido.",
        ]);
        return;
    }

    $datos = $Registros->insertarRegistroSalida($codeEmployee);

    echo json_encode($datos);
    break;

  case 'actualizar':
    $id = $_POST["id"];
    $start = $_POST["start"];
    $finish = $_POST["finish"];
    $ordinary_time = $_POST["ordinary_time"];
    $overtime = $_POST["overtime"];
    $night_overtime = $_POST["night_overtime"];

    // Validar que el ID no esté vacío
    if (empty($id)) {
        echo json_encode([
            "status" => "404", // 404 Bad Request
            "message" => "El id es requerido.",
        ]);
        return;
    }

    $datos = $Registros->actualizarRegistro($id, $start, $finish, $ordinary_time, $overtime, $night_overtime);

    echo json_encode($datos);
    break;

  default:
    echo json_encode([
        "status" => "400", // 400 Bad Request
        "message" => "Operación no válida.",
    ]);
    break;
}
?>
