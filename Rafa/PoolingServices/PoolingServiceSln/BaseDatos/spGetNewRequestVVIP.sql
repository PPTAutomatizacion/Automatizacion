USE [ETLAutomatizacion]
GO
/****** Object:  StoredProcedure [dbo].[spGetNewRequestVVIP]    Script Date: 01/06/2016 10:17:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/************************************************
Nombre: spGetNewRequestVVIP
Objetivo: Verificar si hay novedad en proceso VVIP.
Fecha: 01-06-2016
**************************************************/
ALTER PROCEDURE [dbo].[spGetNewRequestVVIP]
@oNovedad int OUTPUT
AS  

DECLARE @vConsumed smallint


SET @vConsumed = 0

    
    SELECT @oNovedad = COUNT(*)
    FROM BIZ_Peticiones_VVIP 
    WHERE 1=1
	and Consumed = @vConsumed;