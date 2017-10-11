USE [Automatizacion]
GO

/****** Object:  Table [dbo].[Facturacion_Uso]    Script Date: 11/10/2017 14:12:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Facturacion_Uso](
	[codigo_reg_ticket] [char](2) NULL,
	[numero_elem_medicion] [char](100) NULL,
	[cant_tipo_evento] [varchar](10) NULL,
	[descripcion] [varchar](100) NULL,
	[fecha_evento] [varchar](8) NOT NULL,
	[hora_evento] [varchar](6) NULL,
	[tipo_evento] [varchar](6) NULL,
	[oferta_comercial] [nchar](300) NOT NULL,
	[procesado] [nchar](2) NULL
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO