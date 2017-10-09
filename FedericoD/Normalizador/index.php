<html>
<head>
	<title>Normalizador de Direcciones</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link href="https://fonts.googleapis.com/css?family=Gentium+Basic" rel="stylesheet">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<link rel="icon" type="image/png" sizes="192x192"  href="img/favicon-32x32.png">
</head>
<body>
	<div id="header">
		<h1>Normalizador de direcciones</h1>
		<img src="img/Fibercorp_logo_blanco.png">
	</div>
	

	<div id="ayuda" onClick="ayuda()">
		<img src="img/icono_ayuda.png">
		<h3>Ayuda</h3>
	</div>

	<div id="datos_a_procesar">
		<h2>Datos a Procesar</h2>
		<div id="estadisticas">
			<h3>
				Cantidad de Registros en la Base: xxxx
			</h3>


			<h3>
				Cantidad de Registros a procesar: xxxx
			</h3>

			<h3>
				Fecha del día de hoy: xx/xx/xx
			</h3>

			<h3>
				Base de datos de Origen: xxxx
			</h3>

			<h3>
				Base de dato de Destino: xxxx
			</h3>
		</div>
	</div>
<div id="botones">
	<button onClick="verificar_bd()">Verificar Base de Datos</button>
	<button id="iniciar_buttom" onClick="normalizar()">Iniciar Normalización</button>
	<button id="exportar" onClick="exportar_excel()"><img src="img/icono_excel.ico">Exportar a Excel</button>
</div>
	
	<!-- carga y finalizacion de procesos -->
	<div id="estados">
		<div id="verificacion_bd">
			<div class="loader"></div>
			<p>Verificando Base de datos y Obteniendo datos</p>
		</div>

		<div id="verificacion_bd_ok">
			<img src="img/icono_ok.png">
			<p>Datos obtenidos correctamente</p>
		</div>

		<div id="verificacion_bd_error">
			<img src="img/icono_error.png">
			<p>Error al obtener datos. Contacte al administrador</p>
		</div>

		<div id="normalizacion">
			<div class="loader"></div>
			<p>Normalizando direcciones</p>
		</div>


		<div id="normalizacion_ok">
			<img src="img/icono_ok.png">
			<p>Normalización exitosa</p>
		</div>


		<div id="normalizacion_error">
			<img src="img/icono_error.png">
			<p>Error al normalizar. Contacte al administrador</p>
		</div>
	</div>
		

<!--  TABLA DE DATOS  -->
	<div id="cabecera_tabla">
		<p>Visualización de Tabla</p>
	</div>

	<div id="div_tabla"> 
			<table id="tabla_body"> 
					<thead>
						<tr>
							<td> id</td>
							<td> Dirección</td>
							<td> Dirección Normalizada</td>
							<td> Latitud-Longitud</td>
							<td> Observaciones</td>
						</tr>
					</thead>

					<tbody id="table_body">
					
					</tbody>
			</table>
	</div>

<!-- Footer -->

<footer>
	<div>
		
		<h5>Desarrollado por Devoto Federico | Automatización <br>fdevoto@cablevision.com.ar</h5>
	</div>
	
	
</footer> 
</body>
</html>


<script type="text/javascript">
	function verificar_bd () {

		document.getElementById("verificacion_bd_ok").style.display = "none";
		document.getElementById("verificacion_bd_error").style.display = "none";
		document.getElementById("normalizacion").style.display = "none";
		document.getElementById("normalizacion_ok").style.display = "none";
		document.getElementById("normalizacion_error").style.display = "none";
		document.getElementById("verificacion_bd").style.display = "block";

		$.ajax({
				type: "POST",
				url: "consultar_datos_bd.php",
				success: function(msg){
				
						var resultado =	msg.split("|");
					
				
					if(parseInt(resultado[0])==0) // error
					{
						document.getElementById("verificacion_bd").style.display = "none";
						document.getElementById("verificacion_bd_error").style.display = "block";
						console.log(resultado[1]); // error en log
					}
					else
					{
						document.getElementById("verificacion_bd").style.display = "none";
						document.getElementById("verificacion_bd_ok").style.display = "block";
						document.getElementById("iniciar_buttom").style.display = "block";
						$('#estadisticas').empty();
						$('#estadisticas').append(msg);
					}
					
				}
			});
		
	}

	function normalizar () {

		document.getElementById("normalizacion").style.display = "none";
		document.getElementById("normalizacion_ok").style.display = "none";
		document.getElementById("normalizacion_error").style.display = "none";
		document.getElementById("normalizacion").style.display = "block";
	

		$.ajax({
				type: "POST",
				url: "normalizar.php",
				success: function(msg){
					
					if(msg == 0) // error
					{
						document.getElementById("normalizacion").style.display = "none";
						document.getElementById("normalizacion_error").style.display = "block";
					}
					else
					{
						document.getElementById("normalizacion").style.display = "none";
						document.getElementById("normalizacion_ok").style.display = "block";
						document.getElementById("exportar").style.display = "block";
						$('#table_body').append(msg);
					}
				}
			});

		/*$.ajax({
				type: "POST",
				url: "consultar_estadisticas.php",
				success: function(msg){
					

				}
			});*/
		
	}

	function ayuda() {
		window.open('/normalizador/docs/Documentacion.pdf','popup','width=300,height=400');
	}

	function exportar_excel(){
		window.open("exportar_excel.php");
	}

</script>



<!--
***********************************
direccion   lati long
ok			-	  -		  	bien *
fallo		ok	ok			bien *
fallo		mal	mal		   error	*
fallo		-			error *
-			-			error *
-			mal				error *
-			ok				bien	*
***********************************

-->


