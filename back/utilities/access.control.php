<?php

function checkRole($requiredRoles) {
    session_start();

    if (!isset($_SESSION['role']) || !in_array($_SESSION['role'], $requiredRoles)) {
        header('HTTP/1.1 403 Forbidden');
        exit('Acceso denegado');
    }
}

?>
