<?php
require_once("../config/conexion.php");

class SalaryPlan
{
    // Método para obtener todos los planes de salario
    public function todos()
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();

            $cadena = "SELECT * FROM salary_plans";
            $resultado = mysqli_query($con, $cadena);

            if ($resultado && mysqli_num_rows($resultado) > 0) {
                $planes = [];
                while ($row = mysqli_fetch_assoc($resultado)) {
                    $planes[] = $row;
                }

                $con->close();
                return [
                    "status" => "200",
                    "message" => "Planes de salario encontrados.",
                    "data" => $planes,
                ];
            } else {
                $con->close();
                return [
                    "status" => "404",
                    "message" => "No se encontraron planes de salario.",
                    "data" => [],
                ];
            }
        } catch (Exception $e) {
            if (isset($con)) {
                $con->close();
            }
            return [
                "status" => "500",
                "message" => "Error al procesar la solicitud: " . $e->getMessage(),
                "data" => null,
            ];
        }
    }

    // Método para obtener un plan de salario por su ID
    public function uno($user_id)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoConectar();
    
            // Consultar el plan salarial basado en el user_id
            $cadena = "SELECT * FROM salary_plans WHERE user_id = '$user_id'";
            $resultado = mysqli_query($con, $cadena);
    
            if ($resultado && mysqli_num_rows($resultado) > 0) {
                $plan = mysqli_fetch_assoc($resultado);
                $con->close();
                return [
                    "status" => "200",
                    "message" => "Plan de salario encontrado.",
                    "data" => $plan,
                ];
            } else {
                $con->close();
                return [
                    "status" => "404",
                    "message" => "No se encontró el plan de salario.",
                    "data" => null,
                ];
            }
        } catch (Exception $e) {
            if (isset($con)) {
                $con->close();
            }
            return [
                "status" => "500",
                "message" => "Error al procesar la solicitud: " . $e->getMessage(),
                "data" => null,
            ];
        }
    }

    // Método para insertar un nuevo plan de salario
    public function insertar($position_id, $baseSalary, $description, $checkin, $checkout, $esc, $esc_included, $cp_included, $app_included, $dts_included, $dcs_included, $frp_included, $apep_included, $user_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $cadena = "INSERT INTO salary_plans (position_id, baseSalary, description, checkin, checkout, esc, esc_included, cp_included, app_included, dts_included, dcs_included, frp_included, apep_included, user_id) 
                   VALUES ('$position_id', '$baseSalary', '$description', '$checkin', '$checkout', '$esc', '$esc_included', '$cp_included', '$app_included', '$dts_included', '$dcs_included', '$frp_included', '$apep_included', '$user_id')";

        if (mysqli_query($con, $cadena)) {
            $id = mysqli_insert_id($con); 
            $con->close();
            return [
                "status" => "201",
                "message" => "Plan de salario creado correctamente.",
                "data" => [
                    "id" => $id,
                    "position_id" => $position_id,
                    "baseSalary" => $baseSalary,
                    "description" => $description,
                    "checkin" => $checkin,
                    "checkout" => $checkout,
                    "esc" => $esc,
                    "esc_included" => $esc_included,
                    "cp_included" => $cp_included,
                    "app_included" => $app_included,
                    "dts_included" => $dts_included,
                    "dcs_included" => $dcs_included,
                    "frp_included" => $frp_included,
                    "apep_included" => $apep_included,
                    "user_id" => $user_id
                ],
            ];
        } else {
            $con->close();
            return [
                "status" => "500",
                "message" => "Error al crear el plan de salario.",
                "data" => null,
            ];
        }
    }
}
?>
