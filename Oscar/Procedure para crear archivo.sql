USE [Automatizacion]
GO
/****** Object:  StoredProcedure [dbo].[PruebaEscrituraArchivo]    Script Date: 25/08/2017 10:49:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


 
CREATE PROCEDURE [dbo].[EscrituraArchivo]  
	@Archivo varchar(255), 
	@Query varchar(2000),
	@Separador varchar(4)	
AS
BEGIN TRY
 
	declare @Sql nvarchar(2000);
	declare @Resultado nvarchar(50);
	
	set @Sql = 'exec master..xp_cmdshell ' + char(39) + 'bcp "'+ @Query +
		'" queryout "' + @Archivo + '" -w -t "'+@Separador+'" -T -S EQUIPO013032\SQLEXPRESS' + char(39) 
	PRINT @Sql;
	EXECUTE sp_executesql @Sql;
 
	SET @Resultado = 'Exito'
	select @Resultado as Resultado;
 
END TRY
BEGIN CATCH
 
	SET @Resultado = @@ERROR
	select @Resultado as Resultado;
 
END CATCH

