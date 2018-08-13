CREATE TABLE [dbo].[Employee] (
    [GUID]         UNIQUEIDENTIFIER CONSTRAINT [DF_Employee_GUID] DEFAULT (newsequentialid()) NOT NULL,
    [FullName]     NVARCHAR (50)    NOT NULL,
    [PositionGUID] UNIQUEIDENTIFIER NOT NULL,
    [CreateDate]   DATETIME         NOT NULL,
    [UpdateDate]   DATETIME         NULL,
    CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED ([GUID] ASC),
    CONSTRAINT [FK_Employee_Position] FOREIGN KEY ([PositionGUID]) REFERENCES [dbo].[Position] ([GUID])
);

