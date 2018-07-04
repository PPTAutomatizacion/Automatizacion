create table O365_Request 
(
	[Id] varchar(50) not null PRIMARY KEY,
	[DomainMS] varchar(50) not null,
	[ActionDate] DateTime not null,
	[Action] varchar(50) not null,
	[Status] varchar(50) not null
)

create table O365_Request_Subscriptions
(
	[RequestId] varchar(50) not null,
	[SubscriptionId] varchar(50) not null,
	[Status] varchar(50) null,
	CONSTRAINT [PK_Request_Subscriptions] PRIMARY KEY CLUSTERED
	([RequestId], [SubscriptionId])
)
alter table BIZ_CustomersMS add [Enabled] bit not null default 1