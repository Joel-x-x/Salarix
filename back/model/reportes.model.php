<?php

require_once '../config/conexion.php';

class Reporte
{

    /* Procedimiento para obtener todas las nóminas */
    public function reporteNominas($start, $finish)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar y ejecutar la consulta SQL
            $cadena = "SELECT n.*, u.firstname, u.lastname FROM nomina n JOIN users u ON u.id = n.user_id WHERE n.start BETWEEN '$start' AND '$finish'";
            $resultado = mysqli_query($con, $cadena);

            // Verificar si la consulta devolvió resultados
            if ($resultado && mysqli_num_rows($resultado) > 0) {
                // Obtener todas las nóminas como un array
                $nominas = [];
                while ($row = mysqli_fetch_assoc($resultado)) {
                    $nominas[] = $row;
                }

                $con->close(); // Cerrar la conexión
                return [
                    "status" => "200", // 200 OK
                    "message" => 'Nóminas encontradas.',
                    "data" => $nominas,
                ];
            } else {
                $con->close(); // Cerrar la conexión
                return [
                    "status" => "404", // 404 Not Found
                    "message" => 'No se encontraron nóminas.',
                    "data" => [],
                ];
            }
        } catch (Exception $e) {
            // Manejar excepciones y errores
            if (isset($con)) {
                $con->close(); // Cerrar la conexión en caso de error
            }
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => 'Error al procesar la solicitud: ' . $e->getMessage(),
                "data" => null,
            ];
        }
    }

    public function reporteRegistros($startDate, $finishDate)
    {
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
}
