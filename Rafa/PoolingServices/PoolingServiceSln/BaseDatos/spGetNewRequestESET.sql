USE [ETLAutomatizacion]
GO
/****** Object:  StoredProcedure [dbo].[spGetNewRequestESET]    Script Date: 22/04/2016 15:43:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/************************************************
Nombre: spGetNewRequestESET
Objetivo: Verificar si hay novedad en proceso ESET.
Fecha: 22-04-2016
**************************************************/
CREATE PROCEDURE [dbo].[spGetNewRequestESET]
@oNovedad int OUTPUT
AS  

DECLARE @vConsumed smallint


SET @vConsumed = 0

    
    SELECT @oNovedad = COUNT(*)
    FROM BIZ_Peticiones_ESET 
    WHERE 1=1
	and Consumed = @vConsumed;