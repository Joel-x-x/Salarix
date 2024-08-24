<?php

require_once('../config/conexion.php');

class UserDepartment
{

    public function insertar($user_id, $department_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Preparar la consulta para evitar inyección SQL
        $stmt = $con->prepare("SELECT * FROM user_departments WHERE user_id = ? AND department_id = ?");
        $stmt->bind_param("ss", $user_id, $department_id); // 'ss' indica que ambos parámetros son strings
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $response = [
                "status" => "409",
                "message" => "El usuario ya pertenece a este departamento.",
                "data" => null,
            ];
        } else {
            // Preparar la consulta para la inserción
            $stmt = $con->prepare("INSERT INTO user_departments (user_id, department_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $user_id, $department_id);

            if ($stmt->execute()) {
                $response = [
                    "status" => "201",
                    "message" => "Usuario asignado al departamento.",
                    "data" => [
                        "user_id" => $user_id,
                        "department_id" => $department_id,
                    ],
                ];
            } else {
                $response = [
                    "status" => "500",
                    "message" => "Error inesperado, no se pudo asignar el usuario al departamento.",
                    "data" => null,
                ];
            }
        }

        $stmt->close();
        $con->close();

        return json_encode($response);
    }

    public function eliminarRelacion($user_id, $department_id)
    {

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "DELETE FROM user_departments WHERE user_id = $user_id AND department_id = $department_id";
        if (mysqli_query($con, $cadena)) {
            $response = [
                "status" => "200",
                "message" => "Usuario eliminado del departamento.",
                "data" => [
                    "user_id" => $user_id,
                    "department_id" => $department_id,
                ],
            ];
        } else {
            $response = [
                "status" => "500",
                "message" => "Error inesperado, no se pudo eliminar el usuario del departamento.",
                "data" => null,
            ];
        }

        $con->close();

        return json_encode($response);
    }

    public function listarUsuariosPorDepartamento($department_id)
    {

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM user_departments WHERE department_id = $department_id";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [
                "status" => "200",
                "message" => "Usuarios encontrados.",
                "data" => [],
            ];
            while ($row = mysqli_fetch_assoc($result)) {
                $response["data"][] = [
                    "user_id" => $row["user_id"],
                    "department_id" => $row["department_id"],
                ];
            }
        } else {
            $response = [
                "status" => "404",
                "message" => "No se encontraron usuarios en este departamento.",
                "data" => null,
            ];
        }

        $con->close();

        return json_encode($response);
    }
}
