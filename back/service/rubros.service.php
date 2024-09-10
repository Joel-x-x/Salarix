<?php
require_once("../model/formula.model.php"); // Asegúrate de que la ruta sea correcta
require_once("../model/nominas.model.php");
require_once("../model/detail_nomina.model.php");
require_once("../model/salary_plans.model.php");
require_once("../model/employees.model.php");
require_once("../model/registers.model.php");

class RubrosService
{

  public function calcularSueldoBruto($user_id, $nomina_id)
  {
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

    if ($detailNomina['status'] !== '200') {
      // Caso de error
      return $detailNomina;
    }

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

    // Calcular valor hora
    $valorHora = $this->calcularValorHora($sueldoBruto);

    // Register model
    $registroModel = new Register();
    $registros = $registroModel->listarRegistrosPorEmpleadoFechas($user_id, $nomina['data']['start'], $nomina['data']['finish']);

    // Total hora extraordinarias
    $horasExtraordinarias = 0;
    $valorHorasExtraordinarias = 0;
    // Total horas extraordinarias nocturnas
    $horasExtraordinariasNocturnas = 0;
    $valorHorasExtraordinariasNocturnas = 0;

    foreach ($registros['data'] as $registro) {
      $horasExtraordinarias += $registro['overtime'];
      $horasExtraordinariasNocturnas += $registro['night_overtime'];
    }

    // Calcular valor de horas extras
    $valorHorasExtraordinarias = ($valorHora * 1.5) * $horasExtraordinarias;
    $valorHorasExtraordinariasNocturnas = ($valorHora * 2) * $horasExtraordinariasNocturnas;

    // Sumar valor de horas extras al sueldo bruto
    $sueldoBruto = $sueldoBruto + $valorHorasExtraordinarias + $valorHorasExtraordinariasNocturnas;

    // retornar sueldo bruto
    return (float)number_format($sueldoBruto, 2);
  }

  // Calcular valor por hora en base al sueldo bruto
  public function calcularValorHora($sueldoBruto)
  {
    return $sueldoBruto / 160; // 40h por semana x 4 semanas 160 horas totales al mes
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

      // Obtener las formulas
      $formula = $ultimaFormula['data'];

      // Obtener el sueldo bruto
      $sueldoBruto = $this->calcularSueldoBruto($user_id, $nomina_id);
      echo $sueldoBruto;
      echo "<br>";

      // Obtener la nomina
      $nominaModel = new Nomina();
      $nomina = $nominaModel->uno($nomina_id);

      // Mostrar mensaje de error
      if ($nomina['status'] !== '200') {
        return $nomina;
      }

      // Obtener plan salarial del empleado
      $planSalarialModel = new SalaryPlan();
      $planSalarial = $planSalarialModel->uno($user_id);

      // Mostrar mensaje de error
      if ($planSalarial['status'] !== '200') {
        return $planSalarial;
      }

      // Register model
      $registroModel = new Register();
      $registros = $registroModel->listarRegistrosPorEmpleadoFechas($user_id, $nomina['data']['start'], $nomina['data']['finish']);

      // Mostrar mensaje de error
      if ($registros['status'] !== '200') {
        return $registros; // Retorna mensaje de error
      }

      // Obtener los detalles de la nómina
      $detailNominaModel = new DetailNomina();
      $detailNomina = $detailNominaModel->todos($nomina_id);

      if ($detailNomina['status'] !== '200') {
        // Caso de error
        return $detailNomina;
      }

      // Validaciones según los booleanos del plan salarial
      // TODO: pediente por agregar sql
      // if ($plan['cp_included']) {
      //   $cp = $formula['cp']; // Valor de Comisión %

      // }

      if ($plan['app_included']) {
        $app = $formula['app']; // Valor de Aporte Patronal %
        $valorApp = $sueldoBruto * ($app / 100);

        $detailNominaModel->insertar('Aporte patronal', 'Aporte que la empresa realiza al IESS por cada empleado', 1, $valorApp, 0, $nomina_id);
      }

      if ($plan['dts_included']) {
        $dts = $formula['dts']; // Valor de Décimo tercer sueldo
        $valorDts = $sueldoBruto / $dts;

        $detailNominaModel->insertar('Décimo tercer sueldo', 'Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año', 1, $valorApp, 0, $nomina_id);
      }

      if ($plan['dcs_included']) {
        $dcs = $formula['dcs']; // Décimo cuarto sueldo
        $valorDcs = $dcs / 12;

        $detailNominaModel->insertar('Décimo cuarto sueldo', 'Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año', 1, $valorDcs, 0, $nomina_id);
      }

      if ($plan['frp_included']) {
        $frp = $formula['frp']; // Valor de Fondo de reserva % despues de un año trabajando.
        $valorFrp = $sueldoBruto * ($frp / 100);

        $detailNominaModel->insertar('Fondo de reserva', 'Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.', 0, $valorFrp, 0, $nomina_id);
      }

      if ($plan['apep_included']) {
        $apep = $formula['apep']; // Valor de Aporte personal %
        $valorApep = $sueldoBruto * ($apep / 100);
        // TODO: seguir haciendo los detail_nomina
      }

      if ($plan['esc_included']) {
        // Valor de Extensión de salud por Cónyuge
        $esc = $planSalarial['data']['esc'];
        echo $esc;
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
