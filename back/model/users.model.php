<?php

require_once '../config/conexion.php';

class User {

    /*TODO: Procedimiento para insertar un usuario*/
    public function insertar($firstname, $lastname, $email, $password, $role, $status) {
        // Hashear password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
        $cadena = "INSERT INTO users (firstname, lastname, email, password, role, status) VALUES ('$firstname', '$lastname', '$email', '$passwordHash', '$role', '$status')";
        if (mysqli_query($con, $cadena)) {
            return 
            // Response
            $response = [
                "status" => "201",
                "message" => "Usuario creado.",
                "data" => "User",
            ];
        } else {
            return 'Error al insertar en la base de datos';
        }
        $con->close();
    }

    /*TODO: Procedimiento para actualizar un usuario*/
    public function actualizar($id, $firstname, $lastname, $email, $role) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
    
        // Usa comillas simples para valores de texto
        $cadena = "UPDATE users SET firstname = '$firstname', lastname = '$lastname', email = '$email', role = '$role' WHERE id = '$id'";
    
        // Ejecuta la consulta
        if (mysqli_query($con, $cadena)) {
            $con->close(); // Cierra la conexión antes de retornar
            return $id; // Devuelve el ID si la actualización es exitosa
        } else {
            $error = mysqli_error($con); // Obtén el mensaje de error
            $con->close(); // Cierra la conexión
            return 'Error al actualizar el registro: ' . $error; // Devuelve el mensaje de error
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
            return true;
        } else {
            $con->close();
            return false;
        }
    }

    /*TODO: Procedimiento para obtener un usuario por ID*/
    public function uno($id) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
        $cadena = "SELECT id, firstname, lastname, email, role, created, updated, status FROM users WHERE id='$id'";
        $datos = mysqli_query($con, $cadena);
        return $datos;
        $con->close();
    }

    /*TODO: Procedimiento para obtener todos los usuarios*/
    public function todos() {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
        $cadena = "SELECT id, firstname, lastname, email, role, created, updated, status FROM users";
        $datos = mysqli_query($con, $cadena);
        return $datos;
        $con->close();
    }

    /*TODO: Procedimiento logear al usuario */
    public function login($email)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();
            $cadena = "SELECT firstname, lastname, role, status, email, password FROM users WHERE email ='$email'";
            $datos = mysqli_query($con, $cadena);
            return $datos;
        } catch (Throwable $th) {
            return $th->getMessage();
        }
        $con->close();
    }

}
