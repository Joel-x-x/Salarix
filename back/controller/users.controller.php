<?php
error_reporting(0);

/*TODO: Requerimientos */
require_once('../config/sesiones.php');
require_once("../model/users.model.php");

$Usuarios = new User;

switch ($_GET["op"]) {
    /*TODO: Procedimiento para listar todos los registros */
    case 'todos':
        $datos = array();
        $datos = $Usuarios->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    /*TODO: Procedimiento para listar un registros */
    case 'uno':
        $id = $_POST["id"];
        $datos = array();
        $datos = $Usuarios->uno($id);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    /*TODO: Procedimiento para sacar un registro */
    // case 'uno':
        $idUsuarios = $_POST["idUsuarios"];
        $datos = array();
        $datos = $Usuarios->uno($idUsuarios);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    /*TODO: Procedimiento para insertar */
    case 'insertar':
      $firstname = $_POST["firstname"];
      $lastname = $_POST["lastname"];
      $email = $_POST["email"];
      $password = $_POST["password"];
      $role = $_POST["role"];
      $status = true; // default to active
  
      
      if ($firstname && $lastname && $email && $password && $role) {
        $data = $Usuarios->insertar($firstname, $lastname, $email, $password, $role, $status);
          echo json_encode($data);
      } else {
          echo json_encode(['error' => 'all fields are required']);
      }
      break;

    /*TODO: Procedimiento para actualizar */
    case 'actualizar':
        $id = $_POST["id"];
        $firstname = $_POST["firstname"];
        $lastname = $_POST["lastname"];
        $email = $_POST["email"];
        $role = $_POST["role"];

        if ($id) {
            $datos = array();
            $datos = $Usuarios->actualizar($id, $firstname, $lastname, $email, $role);
            echo json_encode($datos);
        } else {
            echo json_encode(['error' => 'ID de usuario requerido']);
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

        if (empty($email) or empty($password)) {
            header("Location:../login.php?op=4");
            exit();
        }

        try {
            $datos = array();
            $datos = $Usuarios->login($email);
            $res = mysqli_fetch_assoc($datos);
        } catch (Throwable $th) {
            header("Location:../login.php?op=1");
            exit();
        }

        try {
            if (is_array($res) and count($res) > 0) {

                if (password_verify($password, $res["password"])) {
                    $_SESSION["id"] = $res["id"];
                    $_SESSION["firstname"] = $res["firstname"];
                    $_SESSION["lastname"] = $res["lastname"];
                    $_SESSION["email"] = $res["email"];
                    $_SESSION["role"] = $res["role"];

                    // header("Location:../views/home.php");
                    echo "paso";
                    exit();
                } else {
                    // header("Location:../login.php?op=1");
                    echo "no paso";
                    exit();
                }
            } else {
                header("Location:../login.php?op=1");
                exit();
            }
        } catch (Exception $th) {
            echo ($th->getMessage());
        }
        break;

    default:
        echo json_encode(['error' => 'Operación no válida']);
        break;
}
?>
