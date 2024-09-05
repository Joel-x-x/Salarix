<?php
error_reporting(0);

require_once("../model/salary_plans.model.php");
require_once("../config/cors.php");

$salaryPlan = new SalaryPlan();

switch ($_GET["op"]) {
  case 'todos':
    $datos = $salaryPlan->todos();
    echo json_encode($datos);
    break;

  case 'uno':
    $user_id = $_POST["user_id"] ?? null;
    if ($user_id) {
      $datos = $salaryPlan->uno($user_id);
      echo json_encode($datos);
    } else {
      echo json_encode([
        "status" => "404",
        "message" => "El user_id es requerido.",
        "data" => null
      ]);
    }
    break;

  case 'insertar':
    $position_id = $_POST['position_id'] ?? null;
    $baseSalary = $_POST['baseSalary'] ?? null;
    $description = $_POST['description'] ?? null;
    $checkin = $_POST['checkin'] ?? null;
    $checkout = $_POST['checkout'] ?? null;
    $esc = $_POST['esc'] ?? null;
    $esc_included = $_POST['esc_included'] ?? false;
    $cp_included = $_POST['cp_included'] ?? false;
    $app_included = $_POST['app_included'] ?? false;
    $dts_included = $_POST['dts_included'] ?? false;
    $dcs_included = $_POST['dcs_included'] ?? false;
    $frp_included = $_POST['frp_included'] ?? false;
    $apep_included = $_POST['apep_included'] ?? false;
    $user_id = $_POST['user_id'] ?? null;

    if ($position_id && $baseSalary && $checkin && $user_id) {
      $data = $salaryPlan->insertar($position_id, $baseSalary, $description, $checkin, $checkout, $esc, $esc_included, $cp_included, $app_included, $dts_included, $dcs_included, $frp_included, $apep_included, $user_id);
      echo json_encode($data);
    } else {
      echo json_encode([
        "status" => "404",
        "message" => "Todos los campos requeridos son necesarios."
      ]);
    }
    break;

  case 'actualizar':
    $id = $_POST['id'] ?? '';
    $user_id = $_POST['user_id'] ?? '';
    $position_id = $_POST['position_id'] ?? '';
    $baseSalary = $_POST['baseSalary'] ?? '';
    $description = $_POST['description'] ?? '';
    $checkin = $_POST['checkin'] ?? '';
    $checkout = $_POST['checkout'] ?? '';
    $esc = $_POST['esc'] ?? '';
    $esc_included = $_POST['esc_included'] ?? null;
    $cp_included = $_POST['cp_included'] ?? null;
    $app_included = $_POST['app_included'] ?? null;
    $dts_included = $_POST['dts_included'] ?? null;
    $dcs_included = $_POST['dcs_included'] ?? null;
    $frp_included = $_POST['frp_included'] ?? null;
    $apep_included = $_POST['apep_included'] ?? null;
    if ($id) {
      $datos = $salaryPlan->actualizar($id, $user_id, $position_id, $baseSalary, $description, $checkin, $checkout, $esc, $esc_included, $cp_included, $app_included, $dts_included, $dcs_included, $frp_included, $apep_included);
      echo json_encode($datos);
    } else {
      echo json_encode([
        "status" => "404",
        "message" => "El id es requerido.",
        "data" => null
      ]);
    }
    break;

  default:
    echo json_encode([
      "status" => "404",
      "message" => 'URL no encontrada.',
      "data" => null,
    ]);
    break;
}
