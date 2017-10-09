<?php 
header("Content-type: application/vnd.ms-excel" ) ; 
header("Content-Disposition: attachment; filename=DatosNormalizados.csv" ) ; 
date_default_timezone_set('UTC');
error_reporting(0);
$fecha = date("Y-m-d");

echo "Datos normalizados del día: ".$fecha;
/* Nombre del servidor. */
$serverName = "10.120.50.10";
/* Usuario y clave.  */
$uid = "fdevoto";
$pwd = "fd3vot0";
/* Array asociativo con la información de la conexion */
$connectionInfo = array( "UID"=>$uid,
"PWD"=>$pwd,
"Database"=>"GIS");
 
/* Nos conectamos mediante la autenticación de SQL Server . */
$conn = sqlsrv_connect( $serverName, $connectionInfo);
$tsql = "select * from GEO_DirsNormalizadas WHERE fechaProceso ='$fecha'";  /* query*/
$stmt = sqlsrv_query( $conn, $tsql); // ejecutamos

$campos = sqlsrv_num_fields($stmt) ; 

	$i=0; 
	echo "<table><tr>"; 
	while($i<$campos){ 
	echo "<td>". sqlsrv_get_field ($stmt, $i) ; 
	echo "</td>"; 
	$i++; 
	} 
	echo "</tr>"; 
	while($row=sqlsrv_fetch_array($stmt)){ 
	echo "<tr>"; 
	for($j=0; $j<$campos; $j++) {
	if($j != 9)
	echo "<td>".$row[$j]."</td>"; 
	} 
	echo "</tr>"; 
	} 
	echo "</table>"; 


?> 