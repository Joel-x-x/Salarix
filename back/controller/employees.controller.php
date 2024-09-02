<?php
error_reporting(0);

/*TODO: Requerimientos */
require_once("../model/employees.model.php");
require_once("../config/cors.php");

$Empleados = new Employee;

switch ($_GET["op"]) {
    /*TODO: Procedimiento para listar todos los registros */
    case 'todos':
        // Llamada a la función para obtener todos los Empleados
        $datos = $Empleados->todos();
        
        // Convertir los datos a formato JSON y enviar la respuesta
        echo json_encode($datos);
        break;

    /*TODO: Procedimiento para listar un registros */
    case 'uno':
        $id = $_POST["id"];
        $datos = $Empleados->uno($id);
        
        // Convertir los datos a formato JSON
        echo json_encode($datos);
        break;

    /*TODO: Procedimiento para insertar */
    case 'insertar':
        $firstname = $_POST["firstname"];
        $lastname = $_POST["lastname"];
        $email = $_POST["email"];
        $password = $_POST["password"];
        $identification = $_POST["identification"];
        $sex = isset($_POST["sex"]); // Convertir a booleano
        $address = $_POST["address"];
        $birthday = $_POST["birthday"];
        $phone = $_POST["phone"];
        $status = isset($_POST["status"]) ? (bool)$_POST["status"] : true; 
  
      
      if ($firstname && $lastname && $email && $password) {
        $data = $Empleados->insertar($firstname, $lastname, $email, $password, $identification, $sex, $address, $birthday, $phone, $status);
          echo json_encode($data);
      } else {
        echo json_encode([
            "status" => "404", // 404 Bad request
            "message" => "Todos los campos son requeridos."
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
?>
