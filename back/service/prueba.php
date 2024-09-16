<?php
  require_once("rubros.service.php");

  $rubros = new RubrosService();

  echo $rubros->calcularRubros('41cfb73e-61d2-11ef-84b2-a2aa5538db1f','41b266b1-6427-11ef-84b2-a2aa5538db1f');
?>