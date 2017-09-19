USE [Automatizacion]
GO
/****** Object:  StoredProcedure [dbo].[PruebaEscrituraArchivo]    Script Date: 22/08/2017 17:08:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 
ALTER PROCEDURE [dbo].[PruebaEscrituraArchivo]  
	@Archivo varchar(255), 
	@Query varchar(2000)	
AS
BEGIN TRY
 
	declare @Sql nvarchar(2000);
	declare @Resultado nvarchar(50);
	
	set @Sql = 'exec master..xp_cmdshell ' + char(39) + 'bcp "'+ @Query +
		'" queryout "' + @Archivo + '" -w -t "|" -T -S EQUIPO013032\SQLEXPRESS' + char(39) 
	PRINT @Sql;
	EXECUTE sp_executesql @Sql;
 
	SET @Resultado = 'Exito'
	select @Resultado as Resultado;
 
END TRY
BEGIN CATCH
 
	SET @Resultado = @@ERROR
	select @Resultado as Resultado;
 
END CATCH

