<?php

require_once('../config/conexion.php');

class Department {

    // Método para insertar un nuevo departamento
    public function insertar($name, $description) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Verificar si el departamento ya existe
        $query = "SELECT * FROM departments WHERE name = '$name'";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $con->close();
            return [
                "status" => "409",
                "message" => "El departamento ya existe.",
            ];
        } else {
            // Insertar el nuevo departamento
            $cadena = "INSERT INTO departments (name, description) VALUES ('$name', '$description')";
            if (mysqli_query($con, $cadena)) {
                // Obtener el último ID insertado
                $idQuery = "SELECT id FROM departments ORDER BY created DESC LIMIT 1";
                $result = mysqli_query($con, $idQuery);

                if ($result && mysqli_num_rows($result) > 0) {
                    $row = mysqli_fetch_assoc($result);
                    $id = $row['id'];

                    $con->close();
                    return [
                        "status" => "201",
                        "message" => "Departamento creado correctamente.",
                        "data" => [
                            "id" => $id,
                            "name" => $name,
                            "description" => $description,
                        ],
                    ];
                } else {
                    $con->close();
                    return [
                        "status" => "500",
                        "message" => "No se pudo recuperar el ID del nuevo registro.",
                    ];
                }
            } else {
                $error = mysqli_error($con);
                $con->close();
                return [
                    "status" => "500",
                    "message" => "Error al crear el departamento: " . $error,
                    "data" => null,
                ];
            }
        }
    }

    // Método para actualizar un departamento
    public function actualizar($id, $name, $description) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "UPDATE departments SET name = '$name', description = '$description' WHERE id = '$id'";
        if (mysqli_query($con, $cadena)) {
            $con->close();
            return [
                "status" => "200",
                "message" => "Departamento actualizado correctamente.",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "description" => $description,
                ],
            ];
        } else {
            $error = mysqli_error($con);
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al actualizar el departamento: " . $error,
                "data" => null,
            ];
        }
    }

    // Método para obtener un departamento por su ID
    public function uno($id) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM departments WHERE id = '$id'";
        $result = mysqli_query($con, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $con->close();
            return [
                "status" => "200",
                "message" => "Departamento encontrado.",
                "data" => [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                ],
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "Departamento no encontrado.",
                "data" => null,
            ];
        }
    }

    // Método para obtener todos los departamentos
    public function todos() {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM departments";
        $result = mysqli_query($con, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                ];
            }
            $con->close();
            return [
                "status" => "200",
                "message" => "Departamentos encontrados.",
                "data" => $data,
            ];
        } else {
            $con->close();
            return [
                "status" => "404",
                "message" => "No se encontraron departamentos.",
                "data" => [],
            ];
        }
    }

    // Método para eliminar un departamento
    public function eliminar($id) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "DELETE FROM departments WHERE id = '$id'";

        if (mysqli_query($con, $cadena)) {
            $con->close();
            return [
                "status" => "200",
                "message" => "Departamento eliminado correctamente.",
                "data" => null,
            ];
        } else {
            $error = mysqli_error($con);
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al eliminar el departamento: " . $error,
                "data" => null,
            ];
        }
    }
}
?>
