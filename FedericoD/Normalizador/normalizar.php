
	
<?php

/*-- ////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!--- FUNCIONES PHP --> */
		// Función para llamar al webservice y devolver el resultado en un array
		function callWebService($direccion,$localidad,$provincia)
		{
		  // url base de la api de GOOGLE
		  $url_base = 'https://maps.googleapis.com/maps/api/geocode/json?';

		  //Datos - Encabezado + valor
		  $encabezado_direccion = 'address=';
		  $direccion = str_replace(" ","+",$direccion); // remplazo espacios por +
		  $componentes = '&components=';
		  $country = "|country:AR";
		  $encabezado_localidad = "|administrative_area_level_2:";
		  $localidad = str_replace(" ","+",$localidad);// remplazo espacios por +
		  $provincia = str_replace(" ","+",$provincia);// remplazo espacios por +
		  $key = "&key=AIzaSyCOIdrpx7SHrWWgUiZeAEQNUv2rxdoK3q8";
		  //$key ="&key=AIzaSyA7BIJJJ8F6Z7Uj4dcpvZ0uoM3HkH3qIh8";
		  //Armo URL final
		  $url = $url_base.$encabezado_direccion.$direccion.$componentes.$encabezado_localidad.$localidad."|administrative_area:".$provincia.$country.$key;
		  $json = file_get_contents($url); // obtengo datos
		  $array = json_decode($json,true); // encode de json -> array
		  // Tratamiento del resultado
		  echo $url;
		  if($array['status'] == "OK")	// ok
		  {
		  	$inicio = preg_split('/,/',$array['results'][0]["formatted_address"]); // obtengo primer parte de la direccion 
		 
		  		

		  	if ((strcmp ( $inicio [0] ,$array['results'][0]['address_components'][0]['long_name']) == 0 && strcmp($array['results'][0]['address_components'][0]['types'][0],"locality") == 0 )|| strcmp ( $inicio [0] ,"Buenos Aires") == 0) { 
		  	// si solo pone la localidad es un error
		  		
		  	return 0;

		  	}
		  	else // todo los datos ok
			{
			  
			  return $array;
		  	}
		  	
		  }
		  else
		  {

		  	return 0;
		  }
		  
		}

		// funcion para buscar por longitud latitud

		function callWebServiceLatiLong($latilong)
		{
		  // url base de la api de GOOGLE
		  $url_base = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
		  $key = "&key=AIzaSyCOIdrpx7SHrWWgUiZeAEQNUv2rxdoK3q8";
		//$key ="&key=AIzaSyA7BIJJJ8F6Z7Uj4dcpvZ0uoM3HkH3qIh8";
		  $country = "&country=AR";
		  $url = $url_base.$latilong.$country.$key;
		  $json = file_get_contents($url); // obtengo datos
		  $array = json_decode($json,true); // encode de json -> array
		  $domicilio_formateado = preg_split('/,/',$array['results'][0]["formatted_address"]);
		  //tratamiento de los datos obtenidos
		   if($array['status'] == "OK")	// ok
		  {			  
		  		if(count($domicilio_formateado)<2)
		  		{
		  			return 0;
		  		}
		  		else
		  		{
		  			 return $array; // retorno del array
		  		}
			 

		  }
		  else
		  {
		  	return 0;
		  }
		  
		}
		  
		
?>




<?php 
	/* //////////////////////////////////////////MAIN//////////////////////////////////////////////////////// */
	include("conexion.php");
	session_start(); // abrir sesion
	header("Content-Type: text/html;charset=utf-8");
	date_default_timezone_set('UTC');
	set_time_limit(0);
	error_reporting(0);
	$time_pre = microtime(true);
	$tsql = "SELECT count(*) FROM GEO_DirsANormalizar WHERE procesado = 0";  /* query*/
	$stmt = sqlsrv_query( $conn, $tsql); // ejecutamos
	$num = sqlsrv_fetch_array($stmt); // obtenemos valor
	
	$tsql = "SELECT * FROM GEO_DirsANormalizar WHERE procesado = 0";  /* query*/
	$stmt = sqlsrv_query( $conn, $tsql); // ejecutamos
	$array = sqlsrv_fetch_array($stmt); // obtenemos valor
	
	//contadores 

	$contadorOK = 0;
	$contadorError = 0;
	$porcentajeOK=0;
	
	if($num[0] > 2500)
	{
		$num[0] = 2500;
	}

	for ($i=0;$i < $num[0]; $i++) {
		// divido datos necesarios
		// inicio los datos nuevamente
			


 		$domicilioNormalizado=$array[2];
     	$observacion = '';
 		$id = $array[0];
		$idExt = $array[1];
		$direccion = $array[2];

		// Direccion: quito las esquinas
		$cantidad =  strpos (  $direccion ,  'e/' );

		if($cantidad != false)
		{
			$direccion = substr ($direccion, 0,  $cantidad );
		}
 		


		$localidad = $array[3];
		$provincia = $array[5];
		$latitud = $array[6];
		$longitud = $array[7];

		// paso a procesado
		$sql = "UPDATE GEO_DirsANormalizar SET procesado = 1 WHERE id = $id";
		$consulta = sqlsrv_query( $conn, $sql);
		echo $sql;
		/* Pruebas*/
	/*$direccion = 'Binnon Nº 211';
		$localidad = 'Carmen de Patagones';
		$provincia = 'Buenos Aires';
		//$latitud = '-3';
		//$longitud = '-5';*/

		// Domicilio y localidad no pueden ser nulos -- probamos obtener valores con direccion
		
		if($provincia == null)
		{
			$rdo = callWebService($direccion,$localidad,"Buenos aires");
		}
		else
		{
			$rdo = callWebService($direccion,$localidad,$provincia);
		}
		
		// vemos resultado de la consulta
		
		if($rdo == 0)//error al obtener datos
		{	
			if($latitud && $longitud) // si tengo estos datos
			{
				$rdo = callWebServiceLatiLong($latitud.",".$longitud);
				
				if($rdo == 0) // error
				{
					$observacion = "Error | No se pudo obtener datos ni por dirección ni Latitud longitud";
				}
				else
				{
					$observacion = "Datos encontrados correctamente mediante Latitud Longitud.";
					$domicilio_formateado = preg_split('/,/',$rdo['results'][0]["formatted_address"]); // obtengo primer parte de la direccion
		
		

						$domicilioNormalizado = $domicilio_formateado[0];
						$latitud = $rdo['results'][0]["geometry"]["location"]["lat"];
						$longitud = $rdo['results'][0]["geometry"]["location"]["lng"];
				}
			}
			else
			{
				$observacion = "Error |No se pudo encontrar dirección y no hay latitud longitud para buscar";
				
			}
			
		}
		else
		{
			
			$observacion = "Dirección encontrada correctamente";
			$domicilio_formateado = preg_split('/,/',$rdo['results'][0]["formatted_address"]); // obtengo primer parte de la direccion

						$domicilioNormalizado = $domicilio_formateado[0];
						$latitud = $rdo['results'][0]["geometry"]["location"]["lat"];
						$longitud = $rdo['results'][0]["geometry"]["location"]["lng"];
		}


		
		
		//echo $direccion." ".$observacion."\n";
		//var_dump($rdo

		$localidad = $domicilio_formateado[1];	
		$partido = $array[4];
		$provincia = $array[5];
		$origen = $array[8];
		$fecha = date("Y-m-d H:i:s");


		//contamos

		 $cantidad =  preg_split("/\|/",$observacion);


		if(count($cantidad) == 2)
		{
			$contadorError++;
		}
		else
		{
			$contadorOK++;
		}
		
		if($i % 2 == 0) // si es par
		{
			echo "<tr style="."\""."background-color:#EFFBFB"."\""."><td>$id</td><td>$direccion</td><td>$domicilioNormalizado</td><td>$latitud,$longitud</td>$latitud,$longitud<td>$observacion</td></tr>";
		}
		else
		{
			echo "<tr style="."\""."background-color:white"."\""."><td>$id</td><td>$direccion</td><td>$domicilioNormalizado</td><td>$latitud,$longitud</td><td>$observacion</td></tr>";
		}
		
		// guardo en BD

		//quito las , 

		$domicilioNormalizado = str_replace (',','.',$domicilioNormalizado);
		$localidad = str_replace (',','.', $localidad);
		$partido = str_replace (',','.',$partido );
		$provincia = str_replace (',','.', $provincia);
		$domicilioNormalizado = str_replace ('\'','´',$domicilioNormalizado);
		$localidad = str_replace ('\'','´',$localidad);
		$partido = str_replace ('\'','´',$partido);
		$provincia = str_replace ('\'','´',$provincia);

		$tsql = "INSERT INTO [dbo].[GEO_DirsNormalizadas]
           ([id]
           ,[idExt]
           ,[domicilio]
           ,[localidad]
           ,[partido]
           ,[provincia]
           ,[latitud]
           ,[longitud]
           ,[origenInfo]
           ,[fechaProceso]
           ,[Observaciones]
           ,[procesadaGIS])
     VALUES
     		('$id',
     		'$idExt',
     		'$domicilioNormalizado',
     		'$localidad',
     		'$partido',
     		'$provincia',
     		'$latitud',
     		'$longitud',
     		'$origen',
     		'$fecha',
     		'$observacion',
     		null
     		)";
     		$stmt2 = sqlsrv_query( $conn, $tsql); // ejecutamos

     		if($stmt2 == false)
     			{
     				echo "No es posible conectarse al servidor.</br>";
					die( print_r( sqlsrv_errors(), true));
     			}		

		$array = sqlsrv_fetch_array($stmt); // obtenemos valor
	}

		$porcentajeOK = $contadorOK * 100;
		$total = $contadorError + $contadorOK;
		$porcentajeOK = $porcentajeOK / $total;
		$porcentajeOK = round($porcentajeOK, 2);
		//calculo tiempo
		$time_post = microtime(true);
		$exec_time = $time_post - $time_pre;
		$exec_time = $exec_time * 0.000006;
		$exec_time = round($exec_time, 2);
		echo '<script> document.getElementById("cantidadRegOk").innerHTML ='.$contadorOK.';</script>';
		echo '<script> document.getElementById("cantidadRegError").innerHTML ='.$contadorError.';</script>';
		echo '<script> document.getElementById("porcentaje").innerHTML ='.$porcentajeOK.';</script>';
		echo '<script> document.getElementById("tiempo").innerHTML ='.$exec_time.';</script>';

 ?>