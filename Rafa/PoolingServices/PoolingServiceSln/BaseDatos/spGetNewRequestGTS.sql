USE [ExternalData]
GO
/****** Object:  StoredProcedure [dbo].[spGetNewRequestGTS]    Script Date: 22/04/2016 17:52:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/************************************************
Nombre: spGetNewRequestGTS
Objetivo: Verificar si hay novedad en proceso GTS.
Fecha: 20-04-2016
**************************************************/
ALTER PROCEDURE [dbo].[spGetNewRequestGTS]
@oNovedad int OUTPUT
AS  

DECLARE @vConsumed smallint
DECLARE @vUpdate smallint

SET @vConsumed = 0
SET @vUpdate = 1
    
    SELECT @oNovedad = COUNT(*)
    FROM BIZ_GTS_ORCAO21190 
    WHERE CONSUMED = @vConsumed
	and UPDATED= @vUpdate;