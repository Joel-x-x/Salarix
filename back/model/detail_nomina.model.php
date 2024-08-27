<?php

require_once '../config/conexion.php';

class DetailNomina {

    /*TODO: Procedimiento para insertar un detalle de nómina*/
    public function insertar($name, $detail, $type, $monto, $nomina_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
        $cadena = "INSERT INTO detail_nomina (name, detail, type, monto, nomina_id) 
                   VALUES ('$name', '$detail', '$type', '$monto', '$nomina_id')";
    
        if (mysqli_query($con, $cadena)) {
            // Obtener el UUID del último registro insertado
            $idQuery = "SELECT id FROM detail_nomina WHERE nomina_id = '$nomina_id' ORDER BY created DESC LIMIT 1";
            $result = mysqli_query($con, $idQuery);
            $id = null;
    
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $id = $row['id'];
            }
    
            $con->close(); // Cerrar la conexión antes de retornar
    
            return [
                "status" => "201", // 201 Created
                "message" => "Detalle de nómina creado.",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "detail" => $detail,
                    "type" => $type,
                    "monto" => $monto,
                    "nomina_id" => $nomina_id
                ],
            ];
        } else {
            $con->close(); // Cerrar la conexión en caso de error
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => "Error inesperado, no se pudo crear el detalle de nómina.",
                "data" => null,
            ];
        }
    }

    /*TODO: Procedimiento para actualizar un detalle de nómina*/
    public function actualizar($id, $name, $detail, $type, $monto, $nomina_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Preparar la consulta SQL
        $cadena = "UPDATE detail_nomina SET 
                   name = '$name', 
                   detail = '$detail', 
                   type = '$type', 
                   monto = '$monto', 
                   nomina_id = '$nomina_id'
                   WHERE id = '$id'";

        // Ejecutar la consulta
        if (mysqli_query($con, $cadena)) {
            $con->close(); // Cerrar la conexión antes de retornar
            return [
                "status" => "200", // 200 OK
                "message" => "Detalle de nómina actualizado.",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "detail" => $detail,
                    "type" => $type,
                    "monto" => $monto,
                    "nomina_id" => $nomina_id
                ],
            ];
        } else {
            $con->close(); // Cerrar la conexión en caso de error
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => "Error inesperado, no se pudo actualizar el detalle de nómina.",
                "data" => null,
            ];
        }
    }

    /*TODO: Procedimiento para obtener un detalle de nómina por ID*/
    public function uno($id)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar la consulta SQL
            $cadena = "SELECT id, name, detail, type, monto, nomina_id FROM detail_nomina WHERE id='$id'";
            $datos = mysqli_query($con, $cadena);

            // Verificar si la consulta devolvió resultados
            if (mysqli_num_rows($datos) > 0) {
                // Obtener el resultado como un array asociativo
                $detalle = mysqli_fetch_assoc($datos);

                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "200", // 200 OK
                    "message" => "Detalle de nómina encontrado.",
                    "data" => $detalle,
                ];
            } else {
                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "404", // 404 Not Found
                    "message" => "Detalle de nómina no encontrado.",
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

    /*TODO: Procedimiento para listar todos los detalles de nómina*/
    public function todos($nomina_id)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();
    
            // Preparar y ejecutar la consulta SQL
            $cadena = "SELECT id, name, detail, type, monto, nomina_id 
                       FROM detail_nomina 
                       WHERE nomina_id = '$nomina_id'";
            $resultado = mysqli_query($con, $cadena);
    
            // Verificar si la consulta devolvió resultados
            if ($resultado && mysqli_num_rows($resultado) > 0) {
                // Obtener todos los detalles como un array
                $detalles = [];
                while ($row = mysqli_fetch_assoc($resultado)) {
                    $detalles[] = $row;
                }
    
                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "200", // 200 OK
                    "message" => "Detalles de nómina encontrados.",
                    "data" => $detalles,
                ];
            } else {
                $con->close(); // Cerrar la conexión antes de retornar
                return [
                    "status" => "404", // 404 Not Found
                    "message" => "No se encontraron detalles de nómina para la nómina especificada.",
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
