<?php

require_once('../config/conexion.php');

class Vacation
{

    public function insertar15dias($user_id)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        $query = "SELECT id, created FROM users WHERE status = 1";
        $result = mysqli_query($con, $query);

        while ($row = mysqli_fetch_assoc($result)) {
            $user_id = $row['id'];
            $created = $row['created'];

            // Calcular los años trabajados
            $years_worked = date('Y') - date('Y', strtotime($created));

            // Verificar si es un nuevo año de trabajo
            if ($years_worked > 0) {
                // Obtener el ultimo registro de vacaciones
                $vacation_query = "SELECT id, totalDays FROM vacations WHERE user_id = $user_id ORDER BY id DESC LIMIT 1";

                $vacation_result = mysqli_query($con, $vacation_query);

                $stmt = $con->prepare($vacation_query);
                $stmt->bind_param('s', $user_id);
                $stmt->execute();
                $vacation_result = $stmt->get_result();
                $vacation = $vacation_result->fetch_assoc();

                if ($vacation && $vacation['totalDays'] < 15 * $years_worked) {
                    $totalDays = $vacation['totalDays'] + 15;
                } else {
                    $totalDays = 15 * $years_worked;
                }

                $cadena = "INSERT INTO vacations (user_id, totalDays) VALUES ($user_id, $totalDays)";

                if (mysqli_query($con, $cadena)) {
                    $response = [
                        "status" => "201",
                        "message" => "Vacaciones creadas.",
                        "data" => [
                            "user_id" => $user_id,
                            "totalDays" => $totalDays,
                        ],
                    ];
                } else {
                    $response = [
                        "status" => "500",
                        "message" => "Error inesperado, no se pudieron crear las vacaciones.",
                        "data" => null,
                    ];
                }
            }
        }

        $con->close();

        return json_encode($response);
    }

    public function solicitarVacaciones($periodo, $daysTaken, $start, $finish, $detail, $user_id){
        $con = new ClaseConectar();
        $con = $con->ProcedimientoConectar();

        // Verificar si el número de daysTaken es menor o igual al totalDays de la tabla
        $vacation_query = "SELECT totalDays FROM vacations WHERE user_id = $user_id ORDER BY id DESC LIMIT 1";
        $vacation_result = mysqli_query($con, $vacation_query);
        $vacation = $vacation_result->fetch_assoc();

        if ($vacation && $daysTaken <= $vacation['totalDays']) {
            // Restar los totalDays menos los daysTaken
            $remainingDays = $vacation['totalDays'] - $daysTaken;

            // Insertar los datos en la tabla vacations
            $update_query = "UPDATE vacations SET periodo = '$periodo', daysTaken = $daysTaken, start = '$start', finish = '$finish', detail = '$detail' WHERE user_id = $user_id";

            if (mysqli_query($con, $update_query)) {
                $response = [
                    "status" => "201",
                    "message" => "Vacaciones solicitadas.",
                    "data" => [
                        "user_id" => $user_id,
                        "periodo" => $periodo,
                        "totalDays" => $remainingDays,
                        "daysTaken" => $daysTaken,
                        "start" => $start,
                        "finish" => $finish,
                        "detail" => $detail,
                    ],
                ];
            } else {
                $response = [
                    "status" => "500",
                    "message" => "Error inesperado, no se pudieron solicitar las vacaciones.",
                    "data" => null,
                ];
            }
        } else {
            $response = [
                "status" => "400",
                "message" => "El número de días solicitados es mayor al total de días disponibles.",
                "data" => null,
            ];
        }

        $con->close();

        return json_encode($response);
    }
}
