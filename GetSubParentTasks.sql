ALTER PROCEDURE [dbo].[GetSubParentTasks]
	@TaskId nvarchar(250)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT T.Id, T.Name, T.Owner, T.Parent, (SELECT COUNT(Id) FROM Tasks IT WHERE IT.Parent = T.Id) AS SubCount
	FROM Tasks T
	WHERE T.Parent = @TaskId
END
