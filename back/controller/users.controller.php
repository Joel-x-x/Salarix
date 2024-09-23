<?php
error_reporting(0);

/*TODO: Requerimientos */
require_once("../model/users.model.php");
require_once("../config/cors.php");

$Usuarios = new User;

switch ($_GET["op"]) {
        /*TODO: Procedimiento para listar todos los registros */
    case 'todos':
        // Llamada a la función para obtener todos los usuarios
        $datos = $Usuarios->todos();

        // Convertir los datos a formato JSON y enviar la respuesta
        echo json_encode($datos);
        break;

        /*TODO: Procedimiento para listar un registros */
    case 'uno':
        $id = $_POST["id"];
        $datos = $Usuarios->uno($id);

        // Convertir los datos a formato JSON
        echo json_encode($datos);
        break;

        /*TODO: Procedimiento para insertar */
    case 'insertar':
        $firstname = $_POST["firstname"];
        $lastname = $_POST["lastname"];
        $email = $_POST["email"];
        $password = $_POST["password"];
        $role = $_POST["role"];
        $status = 1; // default to active


        if ($firstname && $lastname && $email && $password && $role) {
            $data = $Usuarios->insertar($firstname, $lastname, $email, $password, $role, $status);
            echo json_encode($data);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad request
                "message" => "Todos los campos son requeridos."
            ]);
        }
        break;

        /*TODO: Procedimiento para actualizar */
    case 'actualizar':
        $id = $_POST["id"];
        $firstname = $_POST["firstname"];
        $lastname = $_POST["lastname"];
        $email = $_POST["email"];
        $role = $_POST["role"];
        $password = $_POST["password"];
        $identification = $_POST["identification"];
        $sex = $_POST["sex"];
        $address = $_POST["address"];
        $birthday = $_POST["birthday"];
        $phone = $_POST["phone"];
        $codeEmployee = $_POST["codeEmployee"];

        if ($id) {
            $datos = array();
            $datos = $Usuarios->actualizar($id, $firstname, $lastname, $email, $role, $password, $identification, $sex, $address, $birthday, $phone, $codeEmployee);
            echo json_encode($datos);
        } else {
            echo json_encode([
                "status" => "404", // 404 Bad Request
                "message" => "El id es requerido.",
                "data" => null
            ]);
        }
        break;

        /*TODO: Procedimiento para eliminar */
    case 'eliminar':
        $id = $_POST["id"];
        $datos = array();
        $datos = $Usuarios->cambiarEstado($id);
        echo json_encode($datos);
        break;

        /*TODO: Procedimiento para login */
    case 'login':
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Verificar si los campos están vacíos
        if (empty($email) || empty($password)) {
            echo json_encode([
                "status" => "404", // 404 Bad request
                "message" => "Los campos no pueden ir vacios",
            ]);
            return;
        }

        try {
            // Llamar al método de login
            $response = $Usuarios->login($email, $password);

            // Verificar el estado de la respuesta
            if ($response["status"] == "200") {
                $data = $response["data"];

                // Verificar la contraseña
                if (password_verify($password, $data["password"])) {
                    echo json_encode([
                        "status" => $response["status"], // 200 ok
                        "message" => $response["message"],
                        "data" => [
                            "firstname" => $data["firstname"],
                            "lastname" => $data["lastname"],
                            "email" => $data["email"],
                            "role" => $data["role"],
                            "status" => (bool)$data["status"]
                        ],
                    ]);
                } else {
                    // Contraseña incorrecta
                    echo json_encode([
                        "status" => "404", // 404 Bad request
                        "message" => "Credenciales incorrectas.",
                        "data" => null
                    ]);
                }
            } else {
                // Email incorrecto
                echo json_encode([
                    "status" => "404", // 404 Bad request
                    "message" => "Credenciales incorrectas.",
                ]);
            }
        } catch (Throwable $th) {
            // Manejar errores inesperados
            echo json_encode([
                "status" => "500", // 500 Internal Server Error
                "message" => 'Error al procesar la solicitud: ' . $th->getMessage(),
                "data" => null,
            ]);
        }
        break;


    default:
        return json_encode([
            "status" => "404", // 404 Not found
            "message" => 'Url no encontrada.',
            "data" => null,
        ]);
        break;
}
