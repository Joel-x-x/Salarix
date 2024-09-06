<?php
class ClaseConectar
{
    public $conexion;
    protected $db;
    // private $host = "junction.proxy.rlwy.net";
    // private $port = "12773";
    // private $usu = "root";
    // private $clave = "rDYSWZIFEnyiHQUqagsVFkzbkJZUuouB";
    // private $base = "railway";
    private $host = "localhost";
    private $port = "3306";
    private $usu = "root";
    private $clave = "";
    private $base = "railway";

    public function ProcedimientoConectar()
    {
        $this->conexion = mysqli_connect($this->host, $this->usu, $this->clave, $this->base, $this->port);
        mysqli_query($this->conexion, "SET NAMES utf8");
        if (!$this->conexion) {
            die("Error al conectarse con MySQL: " . mysqli_connect_error());
        }
        $this->db = mysqli_select_db($this->conexion, $this->base);
        if (!$this->db) {
            die("Error en la conexión con la base de datos: " . mysqli_error($this->conexion));
        }
        return $this->conexion;
    }

    public function ruta()
    {
        define('BASE_PATH', realpath(dirname(__FILE__) . '/../') . '/');
        // Autoload para clases (si es necesario)
    }
}

?>

