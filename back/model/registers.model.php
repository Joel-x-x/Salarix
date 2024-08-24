<?php
require_once '../config/conexion.php';

class Register
{
  /* TODO: Procedimiento para el primer registro de un usuario */
  public function primerRegistro($codigoEmpleado) {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    // Fecha de inicio
    // Configurar la zona horaria a UTC-5
    date_default_timezone_set('America/Bogota');
    $start = new DateTime();
    $start = $start->format('Y-m-d H:i:s');

    // Consultar el user_id en base al codigoEmpleado
    $consulta = "SELECT id FROM users WHERE codeEmployee = '$codigoEmpleado'";
    $resultado = mysqli_query($con, $consulta);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
      // Obtener el id del usuario
      $row = mysqli_fetch_assoc($resultado);
      $userId = $row['id'];

      // Insertar el registro en la tabla registers
      $cadena = "INSERT INTO registers(start, user_id)
                   VALUES ('$start', '$userId')";

      if (mysqli_query($con, $cadena)) {
        return
          $response = [
            "status" => "201", // 201 Created
            "message" => "Se ha registrado al usuario.",
            "data" => [
              "start" => $start
            ]
          ];
      } else {
        return
          $response = [
            "status" => "500",
            "message" => "Error inesperado, no se pudo registrar al usuario.",
          ];
      }
    } else {
      return
        $response = [
          "status" => "404",
          "message" => "Código de empleado no encontrado.",
        ];
    }
  }
}
