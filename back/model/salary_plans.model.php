<?php
require_once("../config/conexion.php");

class SalaryPlan {
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
            $uuid_query = "SELECT id FROM salary_plans WHERE user_id = '$user_id'";
            $result = mysqli_query($con, $uuid_query);
            $data = mysqli_fetch_assoc($result);
            $uuid = $data['id'];
            $con->close();
            return [
                "status" => "201",
                "message" => "Plan de salario creado correctamente.",
                "data" => [
                    "id" => $uuid,
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
                "message" => "Error al crear el plan de salario."
            ];
        }
    }

    // Método para actualizar un plan de salario existente
    public function actualizar($id, $user_id, $position_id, $baseSalary, $description, $checkin, $checkout, $esc, $esc_included, $cp_included, $app_included, $dts_included, $dcs_included, $frp_included, $apep_included)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();
    
        // Escapar valores para prevenir inyección SQL
        $id = mysqli_real_escape_string($con, $id);
        $user_id = mysqli_real_escape_string($con, $user_id);
        $position_id = mysqli_real_escape_string($con, $position_id);
        $baseSalary = mysqli_real_escape_string($con, $baseSalary);
        $description = mysqli_real_escape_string($con, $description);
        $checkin = mysqli_real_escape_string($con, $checkin);
        $checkout = mysqli_real_escape_string($con, $checkout);
        $esc = mysqli_real_escape_string($con, $esc);
    
        // Arreglo para almacenar las partes de la consulta
        $fields = [];
    
        // Añadir campos solo si no son nulos o vacíos
        if (!empty($position_id)) {
            $fields[] = "position_id = '$position_id'";
        }
        if (!empty($user_id)) {
            $fields[] = "user_id = '$user_id'";
        }
        if (!empty($baseSalary) || $baseSalary === '0') {
            $fields[] = "baseSalary = $baseSalary";
        }
        if (!empty($description)) {
            $fields[] = "description = '$description'";
        }
        if (!empty($checkin)) {
            $fields[] = "checkin = '$checkin'";
        }
        if (!empty($checkout)) {
            $fields[] = "checkout = '$checkout'";
        }
        if (!empty($esc) || $esc === '0') {
            $fields[] = "esc = $esc";
        }
        if (!is_null($esc_included)) { // Considerando que esc_included puede ser 0 o 1
            $fields[] = "esc_included = $esc_included";
        }
        if (!is_null($cp_included)) {
            $fields[] = "cp_included = $cp_included";
        }
        if (!is_null($app_included)) {
            $fields[] = "app_included = $app_included";
        }
        if (!is_null($dts_included)) {
            $fields[] = "dts_included = $dts_included";
        }
        if (!is_null($dcs_included)) {
            $fields[] = "dcs_included = $dcs_included";
        }
        if (!is_null($frp_included)) {
            $fields[] = "frp_included = $frp_included";
        }
        if (!is_null($apep_included)) {
            $fields[] = "apep_included = $apep_included";
        }
    
        // Si no hay campos para actualizar, retornar un error
        if (empty($fields)) {
            $con->close(); // Cierra la conexión antes de retornar
            return [
                "status" => "400", // 400 Bad Request
                "message" => "No se proporcionaron campos para actualizar.",
                "data" => null,
            ];
        }
    
        // Construir la consulta SQL
        $cadena = "UPDATE salary_plans SET " . implode(', ', $fields) . " WHERE id = '$id'";
    
        // Ejecuta la consulta
        if (mysqli_query($con, $cadena)) {
            $responseArray = ["id" => $id]; // Siempre incluir el ID
    
            if (!empty($position_id)) {
                $responseArray["position_id"] = $position_id;
            }
            if (!empty($user_id)) {
                $responseArray["user_id"] = $user_id;
            }
            if (!empty($baseSalary) || $baseSalary === '0') {
                $responseArray["baseSalary"] = $baseSalary;
            }
            if (!empty($description)) {
                $responseArray["description"] = $description;
            }
            if (!empty($checkin)) {
                $responseArray["checkin"] = $checkin;
            }
            if (!empty($checkout)) {
                $responseArray["checkout"] = $checkout;
            }
            if (!empty($esc) || $esc === '0') {
                $responseArray["esc"] = $esc;
            }
            if (!is_null($esc_included)) {
                $responseArray["esc_included"] = $esc_included;
            }
            if (!is_null($cp_included)) {
                $responseArray["cp_included"] = $cp_included;
            }
            if (!is_null($app_included)) {
                $responseArray["app_included"] = $app_included;
            }
            if (!is_null($dts_included)) {
                $responseArray["dts_included"] = $dts_included;
            }
            if (!is_null($dcs_included)) {
                $responseArray["dcs_included"] = $dcs_included;
            }
            if (!is_null($frp_included)) {
                $responseArray["frp_included"] = $frp_included;
            }
            if (!is_null($apep_included)) {
                $responseArray["apep_included"] = $apep_included;
            }
    
            $con->close(); // Cierra la conexión antes de retornar
            // Respuesta
            return [
                "status" => "200", // 200 OK
                "message" => "Plan de salarial actualizado correctamente.",
                "data" => $responseArray,
            ];
        } else {
            $error = mysqli_error($con); // Obtén el mensaje de error
            $con->close(); // Cierra la conexión
            return [
                "status" => "500", // 500 Internal Server Error
                "message" => 'Error al actualizar el plan de salario: ' . $error,
                "data" => null,
            ];
        }
    }
    
}
?>
