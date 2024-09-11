<?php
require_once("../config/conexion.php");

class Formula
{
  public function insertar($cp, $app, $dts, $dcs, $frp, $apep, $escp)
  {
      $con = new ClaseConectar();
      $con = $con->ProcedimientoConectar();
  
      $cadena = "INSERT INTO formula (cp, app, dts, dcs, frp, apep, escp, date) 
                 VALUES ($cp, $app, $dts, $dcs, $frp, $apep, $escp, NOW())";
  
      if (mysqli_query($con, $cadena)) {
          // Obtener el UUID del registro recién insertado
          $id = mysqli_insert_id($con); 
          
          $id = mysqli_query($con, "SELECT id FROM formula ORDER BY date DESC LIMIT 1");
          $id = mysqli_fetch_assoc($id)['id'];
  
          $con->close();
          return [
              "status" => "201",
              "message" => "Registro creado correctamente.",
              "data" => [
                  "id" => $id,
                  "cp" => $cp,
                  "app" => $app,
                  "dts" => $dts,
                  "dcs" => $dcs,
                  "frp" => $frp,
                  "apep" => $apep,
                  "esc" => $escp
              ],
          ];
      } else {
          $con->close();
          return [
              "status" => "500",
              "message" => "Error al crear el registro.",
              "data" => null,
          ];
      }
  }
  
    // Método para listar todos los registros de la tabla 'formula'
    public function todos()
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "SELECT * FROM formula";
        $resultado = mysqli_query($con, $cadena);

        if ($resultado && mysqli_num_rows($resultado) > 0) {
            $datos = [];
            while ($row = mysqli_fetch_assoc($resultado)) {
                $datos[] = $row;
            }
            $con->close();
            return [
                "status" => "200",
                "message" => "Registros encontrados.",
                "data" => $datos,
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "No se encontraron registros.",
                "data" => [],
            ];
        }
    }

    // Método para obtener el último registro basado en la fecha
    public function uno()
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "SELECT * FROM formula ORDER BY date DESC LIMIT 1";
        $resultado = mysqli_query($con, $cadena);

        if ($resultado && mysqli_num_rows($resultado) > 0) {
            $datos = mysqli_fetch_assoc($resultado);
            $con->close();
            return [
                "status" => "200",
                "message" => "Último registro encontrado.",
                "data" => $datos,
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "No se encontró el registro.",
                "data" => null,
            ];
        }
    }
}
?>
