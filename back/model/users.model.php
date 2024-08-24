<?php

require_once '../config/conexion.php';

class User {

    /*TODO: Procedimiento para insertar un usuario*/
    public function insertar($firstname, $lastname, $email, $password, $role, $status)
    {
        // Hashear password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Verificar si el email ya existe
        $query = "SELECT email FROM users WHERE email = '$email'";
        $result = mysqli_query($con, $query);

        // Validar que no se intente usar el rol SUPERADMINISTRADOR por seguridad
        if ($role == 'SUPERADMINISTRADOR') {
            // Violación de seguridad
            return
                $response = [
                    "status" => "403", // 403 Forbidden
                    "message" => "Violación de seguridad.",
                    "data" => null,
                ];
        }

        if (mysqli_num_rows($result) > 0) {
            // El email ya existe
            return
                $response = [
                    "status" => "409", // 409 Conflict
                    "message" => "El email ya está registrado.",
                    "data" => null,
                ];
        } else {
            // El email no existe, proceder con la inserción
            $cadena = "INSERT INTO users (firstname, lastname, email, password, role, status) 
                       VALUES ('$firstname', '$lastname', '$email', '$passwordHash', '$role', '$status')";
            if (mysqli_query($con, $cadena)) {
                return
                    $response = [
                        "status" => "201", // 201 Created
                        "message" => "Usuario creado.",
                        "data" => [
                            "firstname" => $firstname,
                            "lastname" => $lastname,
                            "email" => $email,
                            "role" => $role,
                            "status" => $status
                        ],
                    ];
            } else {
                return
                    $response = [
                        "status" => "500", // 500 Internal Server Error
                        "message" => "Error inesperado, no se pudo crear el usuario.",
                        "data" => null,
                    ];
            }
        }

        // Cerrar la conexión
        $con->close();
    }


    /*TODO: Procedimiento para actualizar un usuario*/

    // TODO: Agregar todos los atributos para actualizar
    public function actualizar($id, $firstname, $lastname, $email, $role)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Arreglo para almacenar las partes de la consulta
        $fields = [];

        // Añadir campos solo si no son nulos o vacíos
        if (!empty($firstname)) {
            $fields[] = "firstname = '$firstname'";
        }
        if (!empty($lastname)) {
            $fields[] = "lastname = '$lastname'";
        }
        if (!empty($email)) {
            $fields[] = "email = '$email'";
        }
        if (!empty($role)) {
            $fields[] = "role = '$role'";
        }

        // Si no hay campos para actualizar, retornar un error
        if (empty($fields)) {
            return
                $response = [
                    "status" => "400", // 400 Bad Request
                    "message" => "No se proporcionaron campos para actualizar.",
                    "data" => null,
                ];
        }

        // Construir la consulta SQL
        $cadena = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = '$id'";

        // Ejecuta la consulta
        if (mysqli_query($con, $cadena)) {
            $con->close(); // Cierra la conexión antes de retornar
            // Crear arreglo data dinámicamente
            $responseArray = ["id" => $id]; // Siempre incluir el ID

            if (!empty($firstname)) {
                $responseArray["firstname"] = $firstname;
            }
            if (!empty($lastname)) {
                $responseArray["lastname"] = $lastname;
            }
            if (!empty($email)) {
                $responseArray["email"] = $email;
            }
            if (!empty($role)) {
                $responseArray["role"] = $role;
            }

            // Respuesta
            return 
            $response = [
                "status" => "200", // 200 OK
                "message" => "Usuario actualizado.",
                "data" => $responseArray,
            ];
        } else {
            $error = mysqli_error($con); // Obtén el mensaje de error
            $con->close(); // Cierra la conexión
            return
                $response = [
                    "status" => "500", // 500 Internal Server Error
                    "message" => 'Error al actualizar el registro: ' . $error,
                    "data" => null,
                ];
        }
    }


    /*TODO: Procedimiento para eliminar un usuario*/
    public function cambiarEstado($id) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // SQL para cambiar el estado al contrario de su valor actual
        $cadena = "UPDATE users SET status = NOT status WHERE id = '$id'";

        if (mysqli_query($con, $cadena)) {
            $con->close();
            return
                $response = [
                    "status" => "200", // 200 ok
                    "message" => 'Estado del usuario actualizado.',
                    "data" => null,
                ];
        } else {
            $con->close();
            return
                $response = [
                    "status" => "500", // 500 Internal Server Error
                    "message" => 'Error al cambiar el estado del usuario.',
                    "data" => null,
                ];
        }
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
    

    /*TODO: Procedimiento logear al usuario */
    public function login($email)
    {
        $response = [
            "status" => "500", // Default error status
            "message" => "Error al procesar la solicitud.",
            "data" => null,
        ];
    
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();
            $cadena = "SELECT firstname, lastname, role, status, email, password FROM users WHERE email = ?";
            
            // Preparar y ejecutar la consulta
            $stmt = $con->prepare($cadena);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $resultado = $stmt->get_result();
            
            if ($resultado->num_rows > 0) {
                // Obtener datos del usuario
                $datos = $resultado->fetch_assoc();
                $response = [
                    "status" => "200", // OK
                    "message" => "Inicio de sesión exitoso.",
                    "data" => $datos,
                ];
            } else {
                $response["message"] = "Correo electrónico no encontrado.";
            }
            
        } catch (Throwable $th) {
            $response["message"] = "Error: " . $th->getMessage();
        } finally {
            if (isset($con)) {
                $con->close(); // Asegúrate de cerrar la conexión en el bloque finally
            }
        }
    
        return $response;
    }
    
}
