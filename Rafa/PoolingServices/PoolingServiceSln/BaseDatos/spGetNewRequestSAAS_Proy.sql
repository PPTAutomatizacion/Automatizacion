USE [ETLAutomatizacion]
GO
/****** Object:  StoredProcedure [dbo].[spGetNewRequestSAAS_Proy]    Script Date: 17/05/2016 15:09:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/************************************************
Nombre: spGetNewRequestSAAS_Proy
Objetivo: Verificar si hay novedad en proceso SAAS PROYECTO.
Fecha: 17-05-2016
**************************************************/
ALTER PROCEDURE [dbo].[spGetNewRequestSAAS_Proy]
@oNovedad int OUTPUT
AS  

DECLARE @vConsumed smallint


SET @vConsumed = 0

    
    SELECT @oNovedad = COUNT(*)
    FROM BIZ_Peticiones_SAAS_Proyecto 
    WHERE 1=1
	and Consumed = @vConsumed;