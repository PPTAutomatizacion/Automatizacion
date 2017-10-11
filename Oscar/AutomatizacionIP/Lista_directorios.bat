FOR /R %%x in (CardControl\Conciliacion*) DO echo %%x >> ArchivosACopiar.txt
FOR /R %%x in (DCV\last*) DO echo %%x >> ArchivosACopiar.txt
FOR /R %%x in (KIWI\conciliacion*) DO echo %%x >> ArchivosACopiar.txt
FOR /R %%x in (Streaming\resumen_magma*) DO echo %%x >> ArchivosACopiar.txt
FOR /R %%x in (WebMkt\Analisis*) DO echo %%x >> ArchivosACopiar.txt


@ECHO OFF
SETLOCAL

NET USE \\10.120.50.10\IPC$ /u:Oscar  Fibercorp2017

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\CardControl\Conciliacion*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"

COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados.txt

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\DCV\last*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados.txt

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\KIWI\conciliacion*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados.txt

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\Streaming\resumen_magma*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados.txt

SET _fuente="\\FC-PROCESOS-TAB\FTPExternalFiles\WebMkt\Analisis*"
SET _destino="C:\DatosExternos\Archivos\Pruebasssssssssssss"
SET _opciones ="/log log.txt"


COPY %_fuente% %_destino% %_opciones% >> ArchivosCopiados.txt



