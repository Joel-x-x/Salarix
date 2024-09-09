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
  public function listarRegistrosPorEmpleado($codeEmployee) {
    $con = new ClaseConectar();
    $con = $con->ProcedimientoConectar();

    $consulta = "SELECT r.*, u.firstname, u.lastname, u.codeEmployee FROM registers r JOIN users u ON u.id = r.user_id WHERE u.codeEmployee = '$codeEmployee'";
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

  /* TODO: Endpoint para listar registros por usuario con filtro de rango de fechas */
public function listarRegistrosPorEmpleadoFechas($user_id, $startDate, $finishDate) {
  $con = new ClaseConectar();
  $con = $con->ProcedimientoConectar();

  // Escapar variables para prevenir inyección SQL
  $user_id = mysqli_real_escape_string($con, $user_id);
  $startDate = mysqli_real_escape_string($con, $startDate);
  $finishDate = mysqli_real_escape_string($con, $finishDate);

  // Consulta modificada para incluir el rango de fechas
  $consulta = "
      SELECT r.*, u.firstname, u.lastname, u.id 
      FROM registers r 
      JOIN users u ON u.id = r.user_id 
      WHERE u.id = '$user_id' 
      AND r.start BETWEEN '$startDate' AND '$finishDate'
  ";

  $resultado = mysqli_query($con, $consulta);

  if ($resultado && mysqli_num_rows($resultado) > 0) {
      $registros = [];
      while ($row = mysqli_fetch_assoc($resultado)) {
          $registros[] = $row;
      }

      return [
          "status" => "200", // 200 OK
          "message" => "Registros encontrados.",
          "data" => $registros
      ];
  } else {
      return [
          "status" => "404",
          "message" => "No se encontraron registros para el usuario.",
      ];
  }
}


/* TODO: Endpoint para listar registros por usuario con filtro de rango de fechas */
public function listarRegistrosPorFechas($startDate, $finishDate) {
  $con = new ClaseConectar();
  $con = $con->ProcedimientoConectar();

  // Escapar variables para prevenir inyección SQL
  $startDate = mysqli_real_escape_string($con, $startDate);
  $finishDate = mysqli_real_escape_string($con, $finishDate);

  $startDateTime = new DateTime($startDate);
  $finishDateTime = new DateTime($finishDate);
  
  // Si las fechas son iguales, agregar " 23:59:59" a $finishDate
  $finishDate = $finishDateTime->format('Y-m-d') . " 23:59:59";

  // Consulta modificada para incluir el rango de fechas
  $consulta = "
      SELECT r.*, u.firstname, u.lastname, u.codeEmployee 
      FROM registers r 
      JOIN users u ON u.id = r.user_id 
      WHERE r.start BETWEEN '$startDate' AND '$finishDate' ";

  $resultado = mysqli_query($con, $consulta);

  if ($resultado && mysqli_num_rows($resultado) > 0) {
      $registros = [];
      while ($row = mysqli_fetch_assoc($resultado)) {
          $registros[] = $row;
      }

      return [
          "status" => "200", // 200 OK
          "message" => "Registros encontrados.",
          "data" => $registros
      ];
  } else {
      return [
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
    $consulta = "SELECT id FROM registers WHERE user_id IN (SELECT id FROM users WHERE codeEmployee = '$codigoEmpleado') AND DATE(start) = CURDATE()";
    $resultado = mysqli_query($con, $consulta);

    if (/* $resultado && mysqli_num_rows($resultado) > 0 */true) {
      // Obtener el ID del registro existente
      $row = mysqli_fetch_assoc($resultado);
      $id = $row['id'];

      // Actualizar el registro existente con la fecha de salida
      $cadena = "UPDATE registers SET finish = '$finish' WHERE id = '$id'";

      if (mysqli_query($con, $cadena)) {
        // Calcular las horas y actualizar los campos correspondientes
        $start = $this->obtenerHoraInicio($id);
        $ordinary_time = $this->calcularHorasOrdinarias($start, $finish);
        $overtime = $this->calcularHorasExtraordinarias($start, $finish);
        $night_overtime = $this->calcularHorasExtraordinariasNocturnas($start, $finish);

        $this->actualizarRegistro($id, $start, $finish, $ordinary_time, $overtime, $night_overtime);

        return [
          "status" => "200", // 200 OK
          "message" => "Registro de salida insertado correctamente.",
          "data" => [
            "finish" => $finish
          ]
        ];
      } else {
        return [
          "status" => "500",
          "message" => "Error inesperado, no se pudo insertar el registro de salida.",
        ];
      }
    } else {
      return [
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

  public function calcularHorasOrdinarias($start, $finish) {
      // Crear objetos DateTime para las horas de inicio y fin
      $start = new DateTime($start);
      $finish = new DateTime($finish);
  
      // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
      $diferencia = $finish->getTimestamp() - $start->getTimestamp();
  
      // Convertir la diferencia a horas y minutos
      $horas = floor($diferencia / 3600);  // Horas completas
      $minutos = ($diferencia % 3600) / 60;  // Minutos restantes como fracción de hora
  
      // Sumar las horas con los minutos convertidos a fracción sobre 60
      $horasFraccion = $horas + ($minutos / 60); // Fracción correcta de horas
  
      // Verificar si las horas son mayores a 9
      if ($horasFraccion > 9) {
          return 9;  // Máximo de 9 horas ordinarias
      } else {
          // Redondear a dos decimales para mantener el formato de horas y minutos
          return round($horasFraccion, 2);
      }
  }
  

  /* TODO: Método para calcular las horas extraordinarias */
  public function calcularHorasExtraordinarias($start, $finish)
  {
      $start = new DateTime($start);
      $finish = new DateTime($finish);
  
      // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
      $diferencia = $finish->getTimestamp() - $start->getTimestamp();
      $horas = $diferencia / 3600;  // Diferencia total en horas
  
      // Horas extraordinarias ordinarias (50% adicional) entre 06:00 y 19:00
      $horasExtrasOrdinarias = 0;
  
      if ($horas > 9) {
          $extraStart = clone $start;
          $extraStart->modify('+9 hours');  // Comienza a contar después de 9 horas
  
          while ($extraStart < $finish) {
              $horaActual = (int)$extraStart->format('H');
  
              // Determina si está en el rango ordinario de 06:00 a 19:00
              if ($horaActual >= 6 && $horaActual < 19) {
                  // Calcular tiempo restante en horas completas
                  $tiempoRestanteSegundos = $finish->getTimestamp() - $extraStart->getTimestamp();
                  if ($tiempoRestanteSegundos >= 3600) {  // Verifica si es al menos una hora completa
                      $horasExtrasOrdinarias += 1;  // Suma solo horas completas
                      $extraStart->modify('+1 hour');  // Avanza a la siguiente hora completa
                  } else {
                      break;  // Salir si no hay tiempo suficiente para otra hora completa
                  }
              } else {
                  $extraStart->modify('+1 hour');  // Incrementar al siguiente rango de hora
              }
          }
      }
  
      return round($horasExtrasOrdinarias, 2);
  }
  

  /* TODO: Método para calcular las horas extraordinarias nocturnas */
  public function calcularHorasExtraordinariasNocturnas($start, $finish)
  {
      $start = new DateTime($start);
      $finish = new DateTime($finish);
  
      // Calcular la diferencia en segundos entre la fecha de inicio y la fecha de fin
      $diferencia = $finish->getTimestamp() - $start->getTimestamp();
      $horas = $diferencia / 3600;
  
      // Horas extraordinarias nocturnas (100% adicional) entre 19:00 y 06:00
      $horasExtrasNocturnas = 0;
  
      if ($horas > 9) {
          $extraStart = clone $start;
          $extraStart->modify('+9 hours');  // Comienza a contar después de 9 horas
  
          while ($extraStart < $finish) {
              $horaActual = (int)$extraStart->format('H');
  
              // Determina si está en el rango nocturno (19:00 - 06:00)
              if ($horaActual >= 19 || $horaActual < 6) {
                  // Calcula tiempo restante en horas completas
                  $tiempoRestanteSegundos = $finish->getTimestamp() - $extraStart->getTimestamp();
                  if ($tiempoRestanteSegundos >= 3600) {  // Verifica si es al menos una hora completa
                      $horasExtrasNocturnas += 1;  // Suma solo horas completas
                      $extraStart->modify('+1 hour');  // Avanza a la siguiente hora completa
                  } else {
                      break;  // Salir si no hay tiempo suficiente para otra hora completa
                  }
              } else {
                  $extraStart->modify('+1 hour');  // Incrementar al siguiente rango de hora
              }
          }
      }
  
      return round($horasExtrasNocturnas, 2);
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
