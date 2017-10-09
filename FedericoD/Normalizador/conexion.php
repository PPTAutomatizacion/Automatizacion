<?php

/* Nombre del servidor. */
$serverName = "10.120.50.10";
/* Usuario y clave.  */
$uid = "fdevoto";
$pwd = "fd3vot0";
/* Array asociativo con la información de la conexion */
$connectionInfo = array( "UID"=>$uid,
"PWD"=>$pwd,
"Database"=>"GIS",
"CharacterSet" => "UTF-8");
 
/* Nos conectamos mediante la autenticación de SQL Server . */
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false )
{
echo "No es posible conectarse al servidor.</br>";
die( print_r( sqlsrv_errors(), true));
}
 


?>