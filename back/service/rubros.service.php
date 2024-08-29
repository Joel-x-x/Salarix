<?php
require_once("../model/formula.model.php"); // Asegúrate de que la ruta sea correcta
require_once("../model/nominas.model.php");
require_once("../model/detail_nomina.model.php");
require_once("../model/salary_plans.model.php");
require_once("../model/employees.model.php");

class RubrosService {

  public function calcularSueldoBruto($user_id, $nomina_id) {
    // Obtener la nomina
    $nominaModel = new Nomina();
    $nomina = $nominaModel->uno($nomina_id);

    // Mostrar mensaje de error
    if ($nomina['status'] !== '200') {
      return $nomina;
    }

    // Obtener los detalles de la nómina
    $detailNominaModel = new DetailNomina();
    $detailNomina = $detailNominaModel->todos($nomina_id);

    if ($detailNomina['status'] === '200') {
      // Filtrar los detalles que tengan isBonus como true o 1
      $detallesFiltrados = array_filter($detailNomina['data'], function ($detalle) {
        return $detalle['isBonus'] == true || $detalle['isBonus'] == 1;
      });

      // Sumar total de bonos
      $sueldoBruto = 0;
      foreach ($detallesFiltrados as $detalle) {
        $sueldoBruto += $detalle['monto'];
      }

      // Obtener plan salarial del empleado
      $planSalarialModel = new SalaryPlan();
      $planSalarial = $planSalarialModel->uno($user_id);

      // Mostrar mensaje de error
      if ($planSalarial['status'] !== '200') {
        return $planSalarial;
      }
      // Sumar el sueldo base a los bonos
      $sueldoBruto += $planSalarial['data']['baseSalary'];

      echo json_encode($sueldoBruto);

    } else {
      // Caso de error
      return $detailNomina;
    }

  }

  public function validarPlanSalarial($user_id, $nomina_id)
  {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    // Consulta para obtener el plan salarial basado en el user_id
    $cadena = "SELECT * FROM salary_plans WHERE user_id = '$user_id'";
    $resultado = mysqli_query($con, $cadena);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
      $plan = mysqli_fetch_assoc($resultado);
      $con->close();

      // Obtener la última fórmula registrada
      $formulaModel = new Formula();
      $ultimaFormula = $formulaModel->uno();

      if ($ultimaFormula['status'] !== '200') {
        return $ultimaFormula;
      }

      // // Obtener salario del empleado
      // $employeeModel = new Employee();
      // $employee = $employeeModel->uno($user_id);

      // if ($employee['status'] !== '200') {
      //   return [
      //     "status" => "500",
      //     "message" => "No se pudo obtener los",
      //     "data" => null,
      //   ];
      // }

      $formula = $ultimaFormula['data'];

      // Validaciones según los booleanos del plan salarial
      if ($plan['cp_included']) {
        $cp = $formula['cp']; // Valor de Comisión %

      }

      if ($plan['app_included']) {
        $app = $formula['app']; // Valor de Aporte Patronal %

      }

      if ($plan['dts_included']) {
        $dts = $formula['dts']; // Valor de Décimo tercer sueldo

      }

      if ($plan['dcs_included']) {
        // Si tienes otro valor relacionado con dcs en la fórmula, puedes acceder a él aquí

      }

      if ($plan['frp_included']) {
        $frp = $formula['frp']; // Valor de Fondo de reserva %

      }

      if ($plan['apep_included']) {
        $apep = $formula['apep']; // Valor de Aporte personal %

      }

      if ($plan['esc_included']) {
        $esc = $formula['esc']; // Valor de Extensión de salud por Cónyuge

      }

      return [
        "status" => "200",
        "message" => "Validaciones completadas.",
        "data" => $plan,
      ];
    } else {
      $con->close();
      return [
        "status" => "404",
        "message" => "No se encontró el plan salarial para el usuario.",
        "data" => null,
      ];
    }
  }
}
