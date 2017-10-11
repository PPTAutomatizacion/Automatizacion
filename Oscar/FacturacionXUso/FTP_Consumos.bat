SET NOMBREARCHIVO=DCV_%DATE:~8,2%%DATE:~3,2%%DATE:~0,2%_%RANDOM:~0,2%.GEN

copy /A "Header.txt" + "Detalle.txt" + "Footer.txt" prueba.txt

type  prueba.txt > %NOMBREARCHIVO%

@echo off
echo user usrConsVariables> ftpcmd.dat
echo ConsumosVariables>> ftpcmd.dat
echo ascii>> ftpcmd.dat
echo put %NOMBREARCHIVO%>> ftpcmd.dat
echo quit>> ftpcmd.dat
ftp -n -s:ftpcmd.dat 192.168.184.190
del ftpcmd.dat
del prueba.txt