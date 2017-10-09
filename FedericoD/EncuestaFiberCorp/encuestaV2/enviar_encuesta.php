<?php

include 'sqlServer.php';
include 'getIp.php';
$conn = conectar("10.120.50.10","BizagiProduccion","BizagiProduccion","GIS");
session_start(); // abrir sesion
date_default_timezone_set('UTC');

$usuario = getRealIP();
$respuesta = $_POST['respuesta'];
$array = preg_split("/,/", $respuesta); // reviso si es un Array
// defino la pregunta realizada - columna en la BD


if($array[0] == 'MC') 
{
    if(count($array) == 1)
    {
        echo 5;
        return;
    
    }
    $sql = "SELECT COUNT(*)
                    FROM [GIS].[dbo].[encuesta_multiple]
                    WHERE usuario = '$usuario'";

                    $stmt = query($conn, $sql);

                    $existe = fecth_array($stmt)[0];
    if($existe > 0)
    {
        $sql = "DELETE
            FROM [GIS].[dbo].[encuesta_multiple]
            WHERE usuario = '$usuario'";
        $stmt = query($conn, $sql);
    }
            
    for($i = 1; $i < count($array) ; $i++)
    {
            $respuesta = $array[$i];
            $sql = "INSERT INTO [GIS].[dbo].[encuesta_multiple] "
            . "(usuario,respuesta) "
            . "VALUES ('$usuario','$respuesta')";
            $stmt = query($conn, $sql);
             if( $stmt === false ) // tratamiento de error
                {

                        die( print_r( sqlsrv_errors(), true) );
                        return;
                } 
    }
    
    
    echo 1;

   
}
else {
            if($_POST['pregunta'] == 0 )
        {
            $columna = "area";
        }
        else
        {
            $columna = "respuesta".$_POST['pregunta'];
        }

        //REVISAR SI EXISTE O NO
        //
        $sql = "SELECT COUNT(*)
        FROM [GIS].[dbo].[encuesta]
        WHERE usuario = '$usuario'";

        $stmt = query($conn, $sql);
        
        $existe =  fecth_array($stmt)[0];
        // Guardamos en la BD

        if($existe == 0) // no existe
        {
            $sql = "INSERT INTO [GIS].[dbo].[encuesta] "
                    . "(usuario,$columna) "
                    . "VALUES ('$usuario','$respuesta')";
        }
        else
        {
            $sql = "UPDATE [GIS].[dbo].[encuesta]
                    SET $columna = '$respuesta'
                    WHERE usuario = '$usuario'";
        }

        $stmt = query($conn, $sql);

                if( $stmt === false ) // tratamiento de error
                {

                        die( print_r( sqlsrv_errors(), true) );
                        return;
                } 
         else {
             echo 1;
         }
}






/* Seccion PRUEBA */
/*$respuesta = $_POST['respuesta'];
$usuario = getRealIP();
$array = preg_split("/,/", $respuesta);

if($array[0] == 'MC') 
{
    for($i = 1; $i < count($array) ; $i++)
    {
        $respuesta = $array[$i];
            $sql = "INSERT INTO [GIS].[dbo].[encuesta_multiple] "
            . "(usuario,respuesta) "
            . "VALUES ('$usuario','$respuesta')";
            $stmt = sqlsrv_query( $conn, $sql); // ejecutamos
    }

   
}
else
{
    echo 1;
}
*/


?>