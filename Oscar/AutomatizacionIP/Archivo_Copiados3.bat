@ECHO OFF
SETLOCAL

NET USE \\10.120.50.10\IPC$ /u:Oscar  Fibercorp2017

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\DCV\last*"
SET _destino="C:\DatosExternos\Archivos"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados3.txt
