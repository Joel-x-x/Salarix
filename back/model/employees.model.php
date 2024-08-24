<?php

require_once '../config/conexion.php';

class Employee
{

    /*TODO: Procedimiento para insertar un usuario*/
    public function insertar($firstname, $lastname, $email, $password, $identification, $sex, $address, $birthday, $phone, $status) {
        // Asignar rol de empleado
        $role = "EMPLEADO";

        // Hashear password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Verificar si el email ya existe
        $query = "SELECT email FROM users WHERE email = '$email'";
        $result = mysqli_query($con, $query);

        if (mysqli_num_rows($result) > 0) {
            // El email ya existe
            return
                $response = [
                    "status" => "409", // 409 Conflict
                    "message" => "El email ya está registrado."
                ];
        } else {
            // Generar codigo de empleado
            $codeEmployee = "";

            $query = "SELECT MAX(codeEmployee) AS maxCode FROM users";
            $result = mysqli_query($con, $query);
            // Verificar si se encontró un código máximo
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $maxCode = $row['maxCode'];

                if ($maxCode) {
                    // Incrementar el código máximo encontrado
                    $codeEmployee = str_pad(intval($maxCode) + 1, 3, '0', STR_PAD_LEFT);
                } else {
                    // Si no hay ningún código, empezar desde '001'
                    $codeEmployee = '001';
                }
            } else {
                // En caso de que no haya registros, iniciar con '001'
                $codeEmployee = '001';
            }

            // El email no existe, proceder con la inserción
            $cadena = "INSERT INTO users (firstname, lastname, email, password, role, identification, sex, address, birthday, phone, codeEmployee, status) 
                       VALUES ('$firstname', '$lastname', '$email', '$passwordHash', '$role',  '$identification', '$sex', '$address', '$birthday', '$phone', '$codeEmployee', '$status')";
            if (mysqli_query($con, $cadena)) {
                return
                    $response = [
                        "status" => "201", // 201 Created
                        "message" => "Empleado creado.",
                        "data" => [
                            "firstname" => $firstname,
                            "lastname" => $lastname,
                            "email" => $email,
                            "role" => $role,
                            "identification" => $identification,
                            "sex" => $sex,
                            "address" => $address,
                            "birthday" => $birthday,
                            "phone" => $phone,
                            "codeEmployee" => $codeEmployee,
                            "status" => $status
                        ],
                    ];
            } else {
                return
                    $response = [
                        "status" => "500", // 500 Internal Server Error
                        "message" => "Error inesperado, no se pudo crear el usuario."
                    ];
            }
        }

        // Cerrar la conexión
        $con->close();
    }

    /*TODO: Procedimiento para obtener un usuario por ID*/
    public function uno($id)
    {
        try {
            // Crear una nueva conexión
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar la consulta SQL
            $cadena = "SELECT id, firstname, lastname, email, role, created, updated, status FROM users WHERE id='$id'";
            $datos = mysqli_query($con, $cadena);

            // Verificar si la consulta devolvió resultados
            if (mysqli_num_rows($datos) > 0) {
                // Obtener el resultado como un array asociativo
                $usuario = mysqli_fetch_assoc($datos);

                // Convertir el campo 'status' a booleano
                $usuario['status'] = (bool)$usuario['status'];

                $con->close(); // Cerrar la conexión
                return [
                    "status" => "200", // 200 OK
                    "message" => 'Usuario encontrado.',
                    "data" => $usuario,
                ];
            } else {
                $con->close(); // Cerrar la conexión
                return [
                    "status" => "404", // 404 Not Found
                    "message" => 'Usuario no encontrado.',
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


    public function todos()
    {
        try {
            // Crear una nueva conexión
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            // Preparar y ejecutar la consulta SQL
            $cadena = "SELECT id, firstname, lastname, email, role, created, updated, status FROM users";
            $resultado = mysqli_query($con, $cadena);

            // Verificar si la consulta devolvió resultados
            if ($resultado && mysqli_num_rows($resultado) > 0) {
                // Obtener todos los usuarios como un array
                $usuarios = [];
                while ($row = mysqli_fetch_assoc($resultado)) {
                    // Convertir el campo 'status' a booleano
                    $row['status'] = (bool)$row['status'];
                    $usuarios[] = $row;
                }

                $con->close(); // Cerrar la conexión
                return [
                    "status" => "200", // 200 OK
                    "message" => 'Usuarios encontrados.',
                    "data" => $usuarios,
                ];
            } else {
                $con->close(); // Cerrar la conexión
                return [
                    "status" => "404", // 404 Not Found
                    "message" => 'No se encontraron usuarios.',
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
