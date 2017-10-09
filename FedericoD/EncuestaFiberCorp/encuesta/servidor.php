<?php

$login = array(
    "seccion" => "Ingreso",
    "pregunta" => "Seleccioná tu área",
    "area1" => "PostVenta",
    "area2" => "Control de Gestión",
    "area3" => "Ingeniería",
    "area4" => "Implementaciones",
    "area5" => "Consultoría y Diseño",
    "area6" => "Empresas y Negocios y Gestiones Comerciales",
    "area7" => "Producto y Mercado",
    "area8" => "Grandes Cuentas e Interior",
    "area9" => "Cuentas Estratégicas",
    "area10" => "Público, Carriers & Canales",
    "area11" => "NOC",
    "areaDefault" => "Seleccione..."
);

$contador = 1;

?>


<!DOCTYPE html>
<html>
    <head>
        <title>Encuesta FiberCorp Nuevos Negocios</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
        <script src="css/jquery-3.2.1.min.js" type="text/javascript"></script> 
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    </head>
    <body>
        <div class="cabecera">
           <h2 class="titulo_principal">Encuesta Proyectos, Procesos y Tecnología</h2>
           <h3 class="titulo_principal" id="seccion">Panel administración</h3>
        </div>
        <!-- Pregunta -->
        <div class="cuerpo">
            <div class="top bgdin" data-color="red" data-bg-mobile="images/contacto/blue-mobile.png" data-bg-tablet="images/contacto/blue-mobile.png" data-bg-desktop="" style="background-image: url(&quot;&quot;);">
                        <div class="inner-content" style="background-color: rgb(0, 121, 225);">
                            <div class="prodcut-top-mobile hidden-lg hidden-md">
                                <span class="ic bgdin" data-bg="https://www.fibercorp.com.ar//picture/familiaprod/iconohome_file/2/0/0" style="background-image: url(&quot;https://www.fibercorp.com.ar//picture/familiaprod/iconohome_file/2/0/0&quot;);"></span>
                            </div>

                            <h4 class="titulo_preg titulo_principal" id="pregunta">Administración de preguntas<br></h4>
                        </div>

                <div class="diagonal2" style="border-top-color: rgb(0, 121, 225);"></div>
                    </div>
            <div class="pregunta">
                <?php include 'conexion.php';
                        session_start(); // abrir sesion
                        date_default_timezone_set('UTC');

                        $sql = "SELECT *
                            FROM[GIS].[dbo].[indice_encuesta]";

                        $stmt = sqlsrv_query( $conn, $sql);
                        $indice = sqlsrv_fetch_array($stmt);
                        $indice = $indice[0];
                        ?>
                <h4 id="label_contador" class=" titulo_principal">Pregunta Actual: </h4>
                <input id="contador" type="text" value="<?php echo $indice ?>" readonly="true"/>
                <img src="img/refrescar.png" width="20" height="20" alt="refrescar" id="refrescar" style="margin-left:1%;cursor:pointer;"/>

            </div>
            
             <!-- BOTON -->
            <a class="btn btn-fiber">
                <span id="enviar">Siguiente</span>
                <span class="ic"></span>
                <div class="diagonal"></div>
            </a>
            <!-- ERROR -->
             <div id="error_ok" style="display:none;">
             </div>

        </div>
        <!-- FOOTER -->
        <div class="footer">
            <footer>
                <img src="img/logo.png" width="239" height="61" alt="logo" class="logo"/>
            </footer>
        </div>
        
        
                
<script>
    var index = 0;
    //verifico cuando cambia el tamaño de la pantalla
    $(window).resize(function() {
             // definir css triangulo
                var tamaño_diagonal = $(".top").width();

                tamaño_diagonal = "solid "+tamaño_diagonal+"px rgba(0, 0, 0, 0)";

                //defino css
               $(".diagonal2").css("border-right",tamaño_diagonal);
              
    });
    
    //defino el css diagonal para el inicio
    // definir css triangulo
     var tamaño_diagonal = $(".top").width();
     
     tamaño_diagonal = "solid "+tamaño_diagonal+"px rgba(0, 0, 0, 0)";
     
     //defino css
    $(".diagonal2").css("border-right",tamaño_diagonal);
    
    $(".btn").click(function(){
        
        var valor = parseInt($("#contador").val());
        
        valor = valor + 1;

        $.ajax({
                    type: "POST",
                    url: "actualizar_indice.php",
                    data: {contador: valor},
                    success: function(msg){
                        
                        $("#contador").val(valor);
                    }});

    });
    
    $("#refrescar").click(function(){
        valor = 0;

        $.ajax({
                    type: "POST",
                    url: "actualizar_indice.php",
                    data: {contador: valor},
                    success: function(msg){
                        
                        $("#contador").val(valor);
                    }});
    })


</script>
    </body>
</html>


