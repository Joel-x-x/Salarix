<?php
require_once("../config/conexion.php");

class Position {
    // Método para insertar un nuevo registro en la tabla 'positions'
    public function insertar($name, $description)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
    
        // Generar la consulta SQL para insertar sin especificar el ID
        $cadena = "INSERT INTO positions (name, description) VALUES ('$name', '$description')";
    
        if (mysqli_query($con, $cadena)) {
            // Obtener el último ID insertado (UUID)
            $idQuery = "SELECT id FROM positions ORDER BY created DESC LIMIT 1";
            $result = mysqli_query($con, $idQuery);
    
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $id = $row['id'];
    
                $con->close();
                return [
                    "status" => "201",
                    "message" => "Posición creada correctamente.",
                    "data" => [
                        "id" => $id,
                        "name" => $name,
                        "description" => $description
                    ],
                ];
            } else {
                $con->close();
                return [
                    "status" => "500",
                    "message" => "No se pudo recuperar el UUID del nuevo registro.",
                    "data" => null,
                ];
            }
        } else {
            $error = mysqli_error($con); // Obtener el mensaje de error
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al crear la posición: " . $error,
                "data" => null,
            ];
        }
    }
    

    // Método para actualizar un registro existente en la tabla 'positions'
    public function actualizar($id, $name, $description)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "UPDATE positions SET name = '$name', description = '$description' WHERE id = '$id'";

        if (mysqli_query($con, $cadena)) {
            $con->close();
            return [
                "status" => "200",
                "message" => "Posición actualizada correctamente.",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "description" => $description
                ],
            ];
        } else {
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al actualizar la posición.",
                "data" => null,
            ];
        }
    }

    // Método para eliminar un registro de la tabla 'positions'
    public function eliminar($id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "DELETE FROM positions WHERE id = '$id'";

        if (mysqli_query($con, $cadena)) {
            $con->close();
            return [
                "status" => "200",
                "message" => "Posición eliminada correctamente.",
                "data" => null,
            ];
        } else {
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al eliminar la posición.",
                "data" => null,
            ];
        }
    }

    // Método para obtener un registro específico de la tabla 'positions' por su ID
    public function uno($id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "SELECT * FROM positions WHERE id = '$id'";
        $resultado = mysqli_query($con, $cadena);

        if ($resultado && mysqli_num_rows($resultado) > 0) {
            $datos = mysqli_fetch_assoc($resultado);
            $con->close();
            return [
                "status" => "200",
                "message" => "Posición encontrada.",
                "data" => $datos,
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "No se encontró la posición.",
                "data" => null,
            ];
        }
    }

    // Método para obtener todos los registros de la tabla 'positions'
    public function todos()
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "SELECT * FROM positions";
        $resultado = mysqli_query($con, $cadena);

        if ($resultado && mysqli_num_rows($resultado) > 0) {
            $datos = [];
            while ($row = mysqli_fetch_assoc($resultado)) {
                $datos[] = $row;
            }
            $con->close();
            return [
                "status" => "200",
                "message" => "Posiciones encontradas.",
                "data" => $datos,
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "No se encontraron posiciones.",
                "data" => [],
            ];
        }
    }
}
?>
