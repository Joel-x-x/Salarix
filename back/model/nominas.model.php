<?php

require_once '../config/conexion.php';

class Nomina
{

    /* Procedimiento para insertar una nómina */
    public function insertar($periodName, $start, $finish, $detail)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Preparar la consulta SQL
        $cadena = "INSERT INTO nomina (periodName, start, finish, detail) 
                   VALUES ('$periodName', '$start', '$finish', '$detail')";

        // Ejecutar la consulta
        if (mysqli_query($con, $cadena)) {
            // Recuperar el ID del nuevo registro
            $idQuery = "SELECT id FROM nomina ORDER BY created DESC LIMIT 1";
            $result = mysqli_query($con, $idQuery);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $id = $row['id'];

                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "201", // 201 Created
                    "message" => "Nómina creada.",
                    "data" => [
                        "id" => $id,
                        "periodName" => $periodName,
                        "start" => $start,
                        "finish" => $finish,
                        "detail" => $detail
                    ],
                ];
            } else {
                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "500", // 500 Internal Server Error
                    "message" => "No se pudo recuperar el ID del nuevo registro.",
                ];
            }
        } else {
            $error = mysqli_error($con); // Obtener el mensaje de error
            $con->close(); // Cerrar la conexión
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => 'Error inesperado, no se pudo crear la nómina: ' . $error,
            ];
        }
    }

    /* Procedimiento para actualizar una nómina */
    public function actualizar($id, $periodName, $start, $finish, $detail, $totalProvision, $totalIncome, $totalEgress, $totalLiquid, $user_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Arreglo para almacenar las partes de la consulta
        $fields = [];

        // Añadir campos solo si no son nulos o vacíos
        if (!empty($periodName)) {
            $fields[] = "periodName = '$periodName'";
        }
        if (!empty($start)) {
            $fields[] = "start = '$start'";
        }
        if (!empty($finish)) {
            $fields[] = "finish = '$finish'";
        }
        if (!empty($detail)) {
            $fields[] = "detail = '$detail'";
        }
        if (!empty($totalProvision)) {
            $fields[] = "totalProvision = '$totalProvision'";
        }
        if (!empty($totalIncome)) {
            $fields[] = "totalIncome = '$totalIncome'";
        }
        if (!empty($totalEgress)) {
            $fields[] = "totalEgress = '$totalEgress'";
        }
        if (!empty($totalLiquid)) {
            $fields[] = "totalLiquid = '$totalLiquid'";
        }
        if (!empty($user_id)) {
            $fields[] = "user_id = '$user_id'";
        }

        // Si no hay campos para actualizar, retornar un error
        if (empty($fields)) {
            return [
                "status" => "400", // 400 Bad Request
                "message" => "No se proporcionaron campos para actualizar.",
                "data" => null,
            ];
        }

        // Construir la consulta SQL
        $cadena = "UPDATE nomina SET " . implode(', ', $fields) . " WHERE id = '$id'";

        // Ejecutar la consulta
        if (mysqli_query($con, $cadena)) {
            $con->close(); // Cerrar la conexión antes de retornar
            // Crear arreglo data dinámicamente
            $responseArray = ["id" => $id]; // Siempre incluir el ID

            if (!empty($periodName)) {
                $responseArray["periodName"] = $periodName;
            }
            if (!empty($start)) {
                $responseArray["start"] = $start;
            }
            if (!empty($finish)) {
                $responseArray["finish"] = $finish;
            }
            if (!empty($detail)) {
                $responseArray["detail"] = $detail;
            }
            if (!empty($totalProvision)) {
                $responseArray["totalProvision"] = $totalProvision;
            }
            if (!empty($totalIncome)) {
                $responseArray["totalIncome"] = $totalIncome;
            }
            if (!empty($totalEgress)) {
                $responseArray["totalEgress"] = $totalEgress;
            }
            if (!empty($totalLiquid)) {
                $responseArray["totalLiquid"] = $totalLiquid;
            }
            if(!empty($user_id)) {
                $responseArray["user_id"] = $user_id;
            }

            // Respuesta
            return [
                "status" => "200", // 200 OK
                "message" => "Nómina actualizada.",
                "data" => $responseArray,
            ];
        } else {
            $error = mysqli_error($con); // Obtener el mensaje de error
            $con->close(); // Cerrar la conexión
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => 'Error al actualizar el registro: ' . $error,
                "data" => null,
            ];
        }
    }

    /* Procedimiento para obtener una nómina por ID */
    public function uno($id)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar la consulta SQL
            $cadena = "SELECT * FROM nomina WHERE id='$id'";
            $datos = mysqli_query($con, $cadena);

            // Verificar si la consulta devolvió resultados
            if (mysqli_num_rows($datos) > 0) {
                // Obtener el resultado como un array asociativo
                $nomina = mysqli_fetch_assoc($datos);

                $con->close(); // Cerrar la conexión
                return [
                    "status" => "200", // 200 OK
                    "message" => 'Nómina encontrada.',
                    "data" => $nomina,
                ];
            } else {
                $con->close(); // Cerrar la conexión
                return [
                    "status" => "404", // 404 Not Found
                    "message" => 'Nómina no encontrada.',
                    "data" => null,
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

    /* Procedimiento para obtener todas las nóminas */
    public function todos()
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar y ejecutar la consulta SQL
            $cadena = "SELECT * FROM nomina";
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
}
