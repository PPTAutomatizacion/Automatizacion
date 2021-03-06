USE [PortalTableau]
GO
/****** Object:  StoredProcedure [dbo].[sp_SearchTableaux]    Script Date: 11/22/2017 11:47:30 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_SearchTableaux]
                        @title nvarchar(150),   
                        @userId bigint
                    AS   

                        SET NOCOUNT ON;  
                       WITH TableauxInfo AS
                       (
		                    SELECT t.Id
			                      ,t.Title
			                      ,t.[Description]
			                      ,t.Code
			                      ,p.Id as ProjectId
			                      ,p.[Name] as ProjectName
			                      ,t.ImageId
			                      ,s.Color as SiteColor
			                      ,s.Code as SiteCode
		                    FROM Tableaux t  
		                    INNER JOIN Projects p ON p.Id = t.ProjectId
		                    INNER JOIN Sites s ON s.Id = p.SiteId
		                    WHERE (t.Title like '%' + @title + '%' OR t.[Description] like '%' + @title + '%')
	                    ),
	                    UserValidTableaux AS 
	                    (
		                    SELECT DISTINCT pt.TableauId
		                    FROM UserPermissions up
		                    INNER JOIN PermissionTableaux pt ON pt.PermissionId = up.PermissionId
		                    WHERE up.UserId = @userId
	                    )
	                    SELECT ti.*
		                      ,CAST((CASE WHEN uvt.TableauId IS NULL THEN 0 ELSE 1 END) AS BIT) AS IsAuthorized
	                    FROM TableauxInfo ti
	                    LEFT JOIN UserValidTableaux uvt ON uvt.TableauId = ti.Id