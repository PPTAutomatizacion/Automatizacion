@ECHO OFF
SETLOCAL

NET USE \\10.120.50.10\IPC$ /u:Oscar  Fibercorp2017

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\CardControl\Conciliacion*"
SET _destino="C:\DatosExternos\Archivos"
SET _opciones ="/log log.txt"

COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados1.txt

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\KIWI\conciliacion*"
SET _destino="C:\DatosExternos\Archivos"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados1.txt


SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\WebMkt\Analisis*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados1.txt