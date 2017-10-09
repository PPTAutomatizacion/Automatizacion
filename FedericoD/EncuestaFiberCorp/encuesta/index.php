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
         "area12" => "PPT",
          "area13" => "Gerencia",
    "areaDefault" => "Seleccione..."
);

$contador = 1;

?>


<!DOCTYPE html>
<html>
    <head>
        <title>Encuesta Proyectos, Procesos y Tecnología</title>
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
           <h2 class="titulo_principal">Encuesta FiberCorp Nuevos Negocios</h2>
           <h3 class="titulo_principal" id="seccion"><?php echo $login['seccion'] ?></h3>
        </div>
        <!-- Pregunta -->
        <div class="cuerpo">
            <div class="top bgdin" data-color="red" data-bg-mobile="images/contacto/blue-mobile.png" data-bg-tablet="images/contacto/blue-mobile.png" data-bg-desktop="" style="background-image: url(&quot;&quot;);">
                        <div class="inner-content" style="background-color: rgb(0, 121, 225);">
                            <div class="prodcut-top-mobile hidden-lg hidden-md">
                                <span class="ic bgdin" data-bg="https://www.fibercorp.com.ar//picture/familiaprod/iconohome_file/2/0/0" style="background-image: url(&quot;https://www.fibercorp.com.ar//picture/familiaprod/iconohome_file/2/0/0&quot;);"></span>
                            </div>

                            <h4 class="titulo_preg titulo_principal" id="pregunta"><?php echo $login['pregunta'] ?><br></h4>
                        </div>

                <div class="diagonal2" style="border-top-color: rgb(0, 121, 225);"></div>
                    </div>
            <div class="pregunta">
               <!-- Opciones -->
               
                <form id="form" action="">
                    

                                <select class="select" id="select">
                                  <option value="<?php echo $login['areaDefault']; ?>" class="texto_secundario"><?php echo $login['areaDefault']; ?></option>
                                  <option value="<?php echo $login['area1']; ?>" class="texto_secundario"><?php echo $login['area1']; ?></option>
                                  <option value="<?php echo $login['area2']; ?>" class="texto_secundario"><?php echo $login['area2']; ?></option>
                                  <option value="<?php echo $login['area3']; ?>" class="texto_secundario"><?php echo $login['area3']; ?></option>
                                  <option value="<?php echo $login['area4']; ?>" class="texto_secundario"><?php echo $login['area4']; ?></option>
                                  <option value="<?php echo $login['area5']; ?>" class="texto_secundario"><?php echo $login['area5']; ?></option>
                                  <option value="<?php echo $login['area6']; ?>" class="texto_secundario"><?php echo $login['area6']; ?></option>
                                  <option value="<?php echo $login['area7']; ?>" class="texto_secundario"><?php echo $login['area7']; ?></option>
                                  <option value="<?php echo $login['area8']; ?>" class="texto_secundario"><?php echo $login['area8']; ?></option>
                                  <option value="<?php echo $login['area9']; ?>" class="texto_secundario"><?php echo $login['area9']; ?></option>
                                  <option value="<?php echo $login['area10']; ?>" class="texto_secundario"><?php echo $login['area10']; ?></option>
                                  <option value="<?php echo $login['area11']; ?>" class="texto_secundario"><?php echo $login['area11']; ?></option>
                                   <option value="<?php echo $login['area12']; ?>" class="texto_secundario"><?php echo $login['area12']; ?></option>
                                   <option value="<?php echo $login['area13']; ?>" class="texto_secundario"><?php echo $login['area13']; ?></option>
                                </select>

               
                </form> 
            </div>
            
             <!-- BOTON -->
            <a class="btn btn-fiber">
                <span id="enviar">Enviar</span>
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
    


    
    //array 
    var encuesta1 = ["Tema1", "¿Conocías los pasos implicados en el punta a punta de un proyecto o requerimiento a procesos?", "Si", "Sólo Algunos Pasos","No"];
    var encuesta2 = ["Tema2", "¿Estás accediento al Desktop Virtual, ícono Proyectos, para visualizar avance y priorización de los proyectos?", "Si", "No"];
    var encuesta3 = ["Tema3", "¿Qué aplicaciones internas de PPT mejoran tu gestión o la del cliente en el día a día (Puede elegir varias opciones)?", "Desktop FiberCorp", "Asistente Virtual","Gestión Online", "GTS(Gestor técnico de soluciones)","Cotizador","Tableros de Monitoreo de Procesos (Tableau)","Activación automatizada de productos (Bizagi)","Ticketera de soporte SAAS (Bizagi)","Scriptings (Atención, Soporte, Comercial)"];
    var encuesta4 = ["Tema4", "¿Pensas que estos proyectos van a sumar a la gestión FiberCorp?", "Si", "No","En parte"];
    var encuesta5 = ["Tema5", "¿Cómo evaluarías en general el evento?", "Muy Bueno", "Bueno","Regular","Deben Mejorar"];
    
    // Lista de array
    var lista = [encuesta1,encuesta2,encuesta3,encuesta4,encuesta5];
   //contador 
    var contador = 0;
    
    var valor; // elegido
    
    // Click Enviar
   $( ".btn" ).click(function() {
       
       //obtengo opción clickeada 
       $("#error_ok").css("display","none");
       if(contador == 0 )
       {
           valor = $('select[id=select]').val();
           
            if(valor == 'Seleccione...')
                {
                   
                    $("#error_ok").html("<h5 style=\"color:red\">Seleccione una respuesta por favor</h5>");
                    $("#error_ok").fadeIn("slow");
                    return;
                }
       }
       else
       {
           if(contador == 3) // Pregunta MC
           {
               
               valor ="MC";
               $('.micheckbox:checked').each(
                    function() {
                        valor = valor + "," + $(this).val();
                    }
                );
        
           }
           else
           {
              valor = $('input:radio[name=opcion]:checked').val();  // Obtengo unica opcion clickeada
           }
           
       }
       
       
       //Valido seleccion de un valor
       if(valor == null)
       {
           $("#error_ok").html("<h5 style=\"color:red\">Seleccione una respuesta por favor</h5>");
           $("#error_ok").fadeIn("slow");
           return;
       }
       else
       {
           $("#error_ok").fadeOut("slow");
       }
       

   
                   

            //AJAX para guardar Datos
            
            $.ajax({
                    type: "POST",
                    url: "enviar_encuesta.php",
                    beforeSend: function(){//loader
                                           $("#error_ok").html("<img id=\"loader\" \" src=\"img/loader.gif\" width=\"50\" height=\"50\" alt=\"loader\"/>");
                                           
                                           
                                           $("#error_ok").fadeIn("slow");
                                          },
                    data: {pregunta: contador, respuesta: valor},
                    success: function(msg){
                        if(msg == 2)
                        {
                            $("#error_ok").html("<h5 style=\"color:red;\">Pregunta No habilitada</h5>");
                            $("#error_ok").fadeIn("slow");
                            return;
                        }
                        if(msg == 1) // sin errorres
                        {
                            
                            $("#error_ok").html("<h5 style=\"color:green;\">Respuesta envíada correctamente.</h5>");
                            $("#error_ok").fadeIn("slow");
                            $('.btn').attr("disabled", true);
                            
                            setTimeout( // agrego un delay para que se vea el mensaje
                                        function() 
                                        {
                                             // oculto error
                                            $("#error_ok").fadeOut("slow");
                                            //cambio datos
                                          $( "#seccion" ).fadeOut( "slow", function() {
                                              $("#seccion").text(lista[contador][0]);
                                           });
                                           $( "#seccion" ).fadeIn( "slow");

                                          $( "#pregunta" ).fadeOut( "slow", function() {
                                              $("#pregunta").text(lista[contador][1]);
                                           });
                                           $( "#pregunta" ).fadeIn( "slow");         

                                         $(".pregunta").fadeOut("slow", function(){

                                             $(".pregunta").html("<form action=\"\" class=\"opciones\">  </form>");
                                             /////////////////////////////////////
                                              //genero opciones
                                            if(contador == lista.length){
                                             $(".btn").fadeOut("slow",function(){ // fin encuesta
                                                 $(".pregunta").html("<h2 style=\"padding-top:20%;\" class=\"titulo_principal\">Muchas Gracias por participar!!</h2>");});

                                             setTimeout(function(){ //delay y redirijo
																	  window.location.href = "https://monitoreoprocesos.fibercorp.com.ar/Fibercorp/final.html";
																	}, 3000);
                                               }
                                               else
                                               {
                                                  for(var i = 2; i< lista[contador].length ; i++){

                                                       if(contador == 2) // genero checkbox
                                                       {
                                                           var opcion = "<input type=\"checkbox\" name=\"opcion[]\" value=\""+lista[contador][i]+"\" class=\"texto_secundario micheckbox\" >"+lista[contador][i]+"<br>";
                                                           //$(".cuerpo").css("height","611px");
                                                           $(".cuerpo").animate({"height" : "611px"});
                                                       }
                                                       else // sino radio
                                                       {
                                                           var opcion = "<input type=\"radio\" name=\"opcion\" value=\""+lista[contador][i]+"\" class=\"texto_secundario\">"+lista[contador][i]+"<br>";
                                                           $(".cuerpo").animate({"height" : "400px"},800,function(){ $('.btn').fadeIn()});
                                                       }  

                                                      $(".opciones").append(opcion);// agrego
                                                  }
                                               }


                                         });
                                                $(".pregunta").fadeIn("slow",function(){contador ++; $('.btn').attr("disabled",false); }); // habilito boton
                                                
                                        }, 1000);
                            
                            
                        }
                        else
                        {
                            if(msg == 5) // no seleccion
                            {
                                $("#error_ok").html("<h5 style=\"color:red;\">Seleccione una respuesta por favor</h5>");
                            }
                            else // error al enviar
                            {
                                $("#error_ok").html("<h5 style=\"color:red;\">Se produjo un Error al envíar respuesta</h5>");
                            }
                            
                            $("#error_ok").fadeIn("slow");
                            return;
                        }
                        
                    }
            });
         
       
 
});



</script>
    </body>
</html>




