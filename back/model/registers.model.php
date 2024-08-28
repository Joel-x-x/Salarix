<?php
require_once '../config/conexion.php';

class Register
{
  /* TODO: Procedimiento para el primer registro de un usuario */
  public function primerRegistro($codigoEmpleado)
  {
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
      $user_id = $row['id'];

      // Insertar el registro en la tabla registers
      $cadena = "INSERT INTO registers(start, user_id)
                   VALUES ('$start', '$user_id')";

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

  /* TODO: Endpoint para listar registros por usuario */
  public function listarRegistrosPorUsuario($user_id)
  {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    $consulta = "SELECT * FROM registers WHERE user_id = '$user_id'";
    $resultado = mysqli_query($con, $consulta);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
      $registros = [];
      while ($row = mysqli_fetch_assoc($resultado)) {
        $registros[] = $row;
      }

      return
        $response = [
          "status" => "200", // 200 OK
          "message" => "Registros encontrados.",
          "data" => $registros
        ];
    } else {
      return
        $response = [
          "status" => "404",
          "message" => "No se encontraron registros para el usuario.",
        ];
    }
  }

  /* TODO: Endpoint para insertar registro de salida */
  public function insertarRegistroSalida($codigoEmpleado)
  {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    // Fecha de salida
    // Configurar la zona horaria a UTC-5
    date_default_timezone_set('America/Bogota');
    $finish = new DateTime();
    $finish = $finish->format('Y-m-d H:i:s');

    // Verificar si ya existe un registro para el mismo día
    $consulta = "SELECT * FROM registers WHERE user_id IN (SELECT id FROM users WHERE codeEmployee = '$codigoEmpleado') AND DATE(start) = CURDATE()";
    $resultado = mysqli_query($con, $consulta);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
      // Actualizar el registro existente con la fecha de salida
      $cadena = "UPDATE registers SET finish = '$finish' WHERE user_id IN (SELECT id FROM users WHERE codeEmployee = '$codigoEmpleado') AND DATE(start) = CURDATE()";

      if (mysqli_query($con, $cadena)) {
        // Calcular las horas y actualizar los campos correspondientes
        $id = mysqli_insert_id($con);
        $start = $this->obtenerHoraInicio($id);
        $ordinary_time = $this->calcularHorasOrdinarias($start, $finish);
        $overtime = $this->calcularHorasExtraordinarias($start, $finish);
        $night_overtime = $this->calcularHorasExtraordinariasNocturnas($start, $finish);

        $this->actualizarRegistro($id, $start, $finish, $ordinary_time, $overtime, $night_overtime);

        return
          $response = [
            "status" => "200", // 200 OK
            "message" => "Registro de salida insertado correctamente.",
            "data" => [
              "finish" => $finish
            ]
          ];
      } else {
        return
          $response = [
            "status" => "500",
            "message" => "Error inesperado, no se pudo insertar el registro de salida.",
          ];
      }
    } else {
      return
        $response = [
          "status" => "404",
          "message" => "No se encontró un registro de inicio para el usuario en el día actual.",
        ];
    }
  }

  /* TODO: Endpoint para actualizar registro */
  public function actualizarRegistro($id, $start, $finish, $ordinary_time, $overtime, $night_overtime)
  {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    $cadena = "UPDATE registers SET start = '$start', finish = '$finish', ordinary_time = '$ordinary_time', overtime = '$overtime', night_overtime = '$night_overtime' WHERE id = '$id'";

    if (mysqli_query($con, $cadena)) {
      return
        $response = [
          "status" => "200", // 200 OK
          "message" => "Registro actualizado correctamente.",
        ];
    } else {
      return
        $response = [
          "status" => "500",
          "message" => "Error inesperado, no se pudo actualizar el registro.",
        ];
    }
  }

  /* TODO: Método para calcular las horas ordinarias */
  public function calcularHorasOrdinarias($start, $finish)
  {
    // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
    $start = new DateTime($start);
    $finish = new DateTime($finish);
    $diferencia = $finish->getTimestamp() - $start->getTimestamp();

    // Convertir la diferencia a horas
    $horas = $diferencia / 3600;

    // Verificar si las horas son mayores a 9
    if ($horas > 9) {
      return 9;
    } else {
      return $horas;
    }
  }

  /* TODO: Método para calcular las horas extraordinarias */
  public function calcularHorasExtraordinarias($start, $finish)
  {
    // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
    $start = new DateTime($start);
    $finish = new DateTime($finish);
    $diferencia = $finish->getTimestamp() - $start->getTimestamp();

    // Convertir la diferencia a horas
    $horas = $diferencia / 3600;

    // Verificar si las horas son mayores a 9
    if ($horas > 9) {
      return $horas - 9;
    } else {
      return 0;
    }
  }

  /* TODO: Método para calcular las horas extraordinarias nocturnas */
  public function calcularHorasExtraordinariasNocturnas($start, $finish)
  {
    // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
    $start = new DateTime($start);
    $finish = new DateTime($finish);
    $diferencia = $finish->getTimestamp() - $start->getTimestamp();

    // Convertir la diferencia a horas
    $horas = $diferencia / 3600;

    // Verificar si las horas son mayores a 9
    if ($horas > 9) {
      return $horas - 9;
    } else {
      return 0;
    }
  }

  /* TODO: Método para obtener la hora de inicio de un registro */
  public function obtenerHoraInicio($id)
  {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    $consulta = "SELECT start FROM registers WHERE id = '$id'";
    $resultado = mysqli_query($con, $consulta);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
      $row = mysqli_fetch_assoc($resultado);
      return $row['start'];
    } else {
      return null;
    }
  }
}
