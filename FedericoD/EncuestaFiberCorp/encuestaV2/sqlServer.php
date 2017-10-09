<?php

function conectar($serverName, $user, $pass, $db){
    
    // armado de array de parametros.
    $connectionInfo = array( "UID"=>$user,
    "PWD"=>$pass,
    "Database"=>$db,"CharacterSet" => "UTF-8"); 
    
    /* Nos conectamos mediante la autenticación de SQL Server . */
    $conexion = sqlsrv_connect( $serverName, $connectionInfo);
    
    /* Control de error */
    if( $conexion === false )
    {
        echo "No es posible conectarse al servidor.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    
    return $conexion;
}

function query($conn , $sql){
    
    $rdo = sqlsrv_query( $conn, $sql); // ejecutamos consulta
    
    return $rdo;
}


function fecth_array($resource){
    
    return sqlsrv_fetch_array($resource);
}

function fetch_object ($resource){
    return sqlsrv_fetch_object( $resource);
}

function num_rows($resource){
    return sqlsrv_num_rows ( $resource );
}

?>