CREATE TABLE [dbo].[Position] (
    [GUID]       UNIQUEIDENTIFIER CONSTRAINT [DF_Position_GUID] DEFAULT (newsequentialid()) NOT NULL,
    [Name]       NVARCHAR (50)    NOT NULL,
    [CreateDate] DATETIME         NOT NULL,
    [UpdateDate] DATETIME         NULL,
    CONSTRAINT [PK_Position] PRIMARY KEY CLUSTERED ([GUID] ASC)
);

