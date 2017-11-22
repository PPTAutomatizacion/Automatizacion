@ECHO OFF
SETLOCAL

NET USE \\10.120.50.10\IPC$ /u:Oscar  Fibercorp2017

SET _fuente="C:\DatosExternos\Archivos\Implementaciones\Status*"
SET _destino="\\FC-PROCESOS-TAB\FTPExternalFiles\Implementaciones"
SET _opciones ="/log log.txt"

COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados4.txt