<?php

include("conexion.php");
session_start(); // abrir sesion
date_default_timezone_set('UTC');

/* Estadísticas */
//cantidad de elementos totales de la base que no esten procesador
$tsql = "SELECT count(*) FROM GEO_DirsANormalizar WHERE procesado = 0 ";  /* query*/
$stmt = sqlsrv_query( $conn, $tsql); // ejecutamos

	if( $stmt === false ) // tratamiento de error
	{
		echo "0|Error al realizar consulta - Consultar_datos_bd.php - Linea 14"; // error 
		//die( print_r( sqlsrv_errors(), true) );
		return;
	} 
	$num = sqlsrv_fetch_array($stmt); // obtenemos valor
	// registros a procesar, validar los 2500 por dia
	if($num[0]>2500)
	{
		$reg_a_procesar = $num[0] - 2500;
		$reg_a_procesar = $num[0] - $reg_a_procesar;
	}
	else
	{
		$reg_a_procesar = $num[0];
	}
	
	if($num == '')
	{
		$reg_a_procesar = 0;
		$registros_base = 0;
	}
	else
	{
		$registros_base = $num[0];
	}
	
	
	
	$fecha = date("Y-m-d H:i:s");
	
echo "<h3>Cantidad de Registros en la base: ".'<spam style="color:red">'.$registros_base."</spam>"."</h3>".
	  "<h3>Cantidad de Registros a Procesar: ".'<spam style="color:red">'.$reg_a_procesar."</spam>"."</h3>".
	  "<h3>Fecha del día de Hoy: ".'<spam style="color:red">'.$fecha."</spam>"."</h3>".
	  '<h3>Base de datos de Origen: <spam style="color:red"> GEO_DirsANormalizar</spam></h3>'.
	  '<h3>Base de datos de destino: <spam style="color:red">GEO_DirsNormalizadas</spam></h3>'.
	  '<h3>Cantidad de Registros Encontrados: <spam id="cantidadRegOk"style="color:red">0</spam></h3>'.
	  '<h3>Cantidad de Registros Error:  <spam id="cantidadRegError"style="color:red">0</spam></h3>'.
	  '<h3>Porcentaje de correctos:  <spam id="porcentaje"style="color:red">0</spam>%</h3>'.
	  '<h3>Tiempo Ejecución:  <spam id="tiempo"style="color:red">0</spam> segundos</h3>';

/* Cerramos la conexión, muy importante. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);


?>