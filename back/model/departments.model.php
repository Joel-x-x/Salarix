<?php

require_once('../config/conexion.php');

class Department {

    /* TODO: Procedimiento para insertar un departamento */

    public function insertar ($name, $description){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Verificar si el departamento ya existe con name
        $query = "SELECT * FROM departments WHERE name = '$name'";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [
                "status" => "409",
                "message" => "El departamento ya existe.",
                "data" => null,
            ];
        } else {
            // El departamento no existe, proceder con la inserción
            $cadena = "INSERT INTO departments (name, description) VALUES ('$name', '$description')";
            if (mysqli_query($con, $cadena)) {
                $response = [
                    "status" => "201",
                    "message" => "Departamento creado.",
                    "data" => [
                        "name" => $name,
                        "description" => $description,
                    ],
                ];
            } else {
                $response = [
                    "status" => "500",
                    "message" => "Error inesperado, no se pudo crear el departamento.",
                    "data" => null,
                ];
            }
        }
        // Cerrar la conexión
        $con->close();
        // Retornar la respuesta como JSON
        return json_encode($response);

    }

    /*TODO: Procedimiento para actualizar un departamento*/

    public function actualizar ($id, $name, $description){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "UPDATE departments SET name = '$name', description = '$description' WHERE id = $id";
        if (mysqli_query($con, $cadena)) {
            $response = [
                "status" => "200",
                "message" => "Departamento actualizado.",
                "data" => [
                    "name" => $name,
                    "description" => $description,
                ],
            ];
        } else {
            $response = [
                "status" => "500",
                "message" => "Error inesperado, no se pudo actualizar el departamento.",
                "data" => null,
            ];
        }
        // Cerrar la conexión
        $con->close();
        // Retornar la respuesta como JSON
        return json_encode($response);

    }

    /*TODO: Procedimiento para obtener un departamento con ID*/

    public function uno ($id){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM departments WHERE id = $id";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $response = [
                "status" => "200",
                "message" => "Departamento encontrado.",
                "data" => [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                ],
            ];
        } else {
            $response = [
                "status" => "404",
                "message" => "Departamento no encontrado.",
                "data" => null,
            ];
        }
        // Cerrar la conexión
        $con->close();
        // Retornar la respuesta como JSON
        return json_encode($response);

    }

    /*TODO: Procedimiento para obtener todos los departamentos*/

    public function todos(){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM departments";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                ];
            }
            $response = [
                "status" => "200",
                "message" => "Departamentos encontrados.",
                "data" => $data,
            ];
        } else {
            $response = [
                "status" => "404",
                "message" => "No se encontraron departamentos.",
                "data" => null,
            ];
        }
        // Cerrar la conexión
        $con->close();
        // Retornar la respuesta como JSON
        return json_encode($response);

    }

}