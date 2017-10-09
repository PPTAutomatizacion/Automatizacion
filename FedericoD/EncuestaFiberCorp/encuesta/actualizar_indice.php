<?php
include 'conexion.php';
session_start(); // abrir sesion
date_default_timezone_set('UTC');

$valor = $_POST['contador'];

$sql = "UPDATE [GIS].[dbo].[indice_encuesta]
        SET indice = $valor";

$stmt = sqlsrv_query( $conn, $sql);
 ?>