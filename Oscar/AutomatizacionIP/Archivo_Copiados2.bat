@ECHO OFF
SETLOCAL

NET USE \\10.120.50.10\IPC$ /u:Oscar  Fibercorp2017

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\Streaming\resumen_magma*"
SET _destino="C:\DatosExternos\Archivos"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados2.txt
