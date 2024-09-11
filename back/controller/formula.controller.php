<?php
// error_reporting(E_ALL); // Cambiar a E_ALL para mejor depuración
error_reporting(0);

require_once("../model/formula.model.php");
require_once("../config/cors.php");

$Formula = new Formula;

switch ($_GET["op"]) {
    case 'todos':
        $datos = $Formula->todos();
        echo json_encode($datos);
        break;

    case 'ultimo':
        $datos = $Formula->uno(); // Llamada al método actualizado para obtener el último registro
        echo json_encode($datos);
        break;

    case 'insertar':
        $cp = $_POST["cp"];
        $app = $_POST["app"];
        $dts = $_POST["dts"];
        $dtc = $_POST["dtc"];
        $frp = $_POST["frp"];
        $apep = $_POST["apep"];
        $escp = $_POST["escp"];

        if ($cp && $app && $dts && $dcs && $frp && $apep && $escp) {
            $data = $Formula->insertar($cp, $app, $dts, $dcs, $frp, $apep, $escp);
            echo json_encode($data);
        } else {
            echo json_encode([
                "status" => "404",
                "message" => "Todos los campos son requeridos."
            ]);
        }
        break;

    default:
        echo json_encode([
            "status" => "404",
            "message" => "Url no encontrada.",
            "data" => null,
        ]);
        break;
}
?>
