<?php

require_once('../config/conexion.php');

class Dependent{

    /*TODO: Procedimiento para insertar un dependiente*/

    public function insertar($name, $lastname, $relation, $disability, $birthday, $status, $id_user){
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Convertir el valor de disability a booleano y luego a entero
        $disability = filter_var($disability, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

        // Verificar si el dependiente ya existe con name y lastname
        $query = "SELECT * FROM dependents WHERE name = '$name' AND lastname = '$lastname'";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [
                "status" => "409", // 409 Conflict
                "message" => "El dependiente ya existe.",
                "data" => null,
            ];
        } else {
            // El dependiente no existe, proceder con la inserción
            $cadena = "INSERT INTO dependents (name, lastname, relation, disability, birthday, status, id_user) 
                       VALUES ('$name', '$lastname', '$relation', $disability, '$birthday', '$status', '$id_user')";
            if (mysqli_query($con, $cadena)) {
                $response = [
                    "status" => "201", // 201 Created
                    "message" => "Dependiente creado.",
                    "data" => [
                        "name" => $name,
                        "lastname" => $lastname,
                        "relation" => $relation,
                        "disability" => $disability,
                        "birthday" => $birthday,
                        "status" => $status,
                        "id_user" => $id_user
                    ],
                ];
            } else {
                $response = [
                    "status" => "500", // 500 Internal Server Error
                    "message" => "Error inesperado, no se pudo crear el dependiente.",
                    "data" => null,
                ];
            }
        }

        // Cerrar la conexión
        $con->close();

        // Retornar la respuesta como JSON
        return json_encode($response);
    }

    /*TODO: Procedimiento para actualizar un dependiente*/
    public function actualizar($id, $name, $lastname, $relation, $disability, $birthday, $id_user){
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "UPDATE dependents SET name = '$name', lastname = '$lastname', relation = '$relation', disability = '$disability', birthday = '$birthday', id_user = '$id_user' WHERE id = '$id'";
        if (mysqli_query($con, $cadena)) {
            $response = [
                "status" => "200", // 200 OK
                "message" => "Dependiente actualizado.",
                "data" => [
                    "name" => $name,
                    "lastname" => $lastname,
                    "relation" => $relation,
                    "disabillity" => $disability,
                    "birthday" => $birthday,
                    "id_user" => $id_user
                ],
            ];
        } else {
            $response = [
                "status" => "500", // 500 Internal Server Error
                "message" => "Error inesperado, no se pudo actualizar el dependiente.",
                "data" => null,
            ];
        }

        // Cerrar la conexión
        $con->close();

        // Retornar la respuesta como JSON
        return json_encode($response);
    }

    /*TODO: Procedimiento para eliminar un dependiente*/

    public function cambiarEstado($id){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "UPDATE dependents SET status = NOT status WHERE id = '$id'";
        if (mysqli_query($con, $cadena)) {
            $response = [
                "status" => "200", // 200 OK
                "message" => "Dependiente eliminado.",
                "data" => null,
            ];
        } else {
            $response = [
                "status" => "500", // 500 Internal Server Error
                "message" => "Error inesperado, no se pudo eliminar el dependiente.",
                "data" => null,
            ];
        }

        // Cerrar la conexión
        $con->close();

        // Retornar la respuesta como JSON
        return json_encode($response);

    }

    /* TODO: Procedimiento para obtener dependiente por ID */

    public function uno($id){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM dependents WHERE id = '$id'";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $response = [
                "status" => "200", // 200 OK
                "message" => "Dependiente encontrado.",
                "data" => $row,
            ];
        } else {
            $response = [
                "status" => "404", // 404 Not Found
                "message" => "El dependiente no existe.",
                "data" => null,
            ];
        }

        // Cerrar la conexión
        $con->close();

        // Retornar la respuesta como JSON
        return json_encode($response);
    }

    /* TODO: Procedimiento para obtener todos los dependientes */ 

    public function todos(){

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT * FROM dependents";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            $data = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            $response = [
                "status" => "200", // 200 OK
                "message" => "Dependientes encontrados.",
                "data" => $data,
            ];
        } else {
            $response = [
                "status" => "404", // 404 Not Found
                "message" => "No se encontraron dependientes.",
                "data" => null,
            ];
        }

        // Cerrar la conexión
        $con->close();

        // Retornar la respuesta como JSON
        return json_encode($response);
    }

}

