ALTER PROCEDURE [dbo].[DeleteTask]
	@TaskId int
AS
BEGIN
	SET NOCOUNT ON;

	WITH tree as (
	  SELECT id, parent
	  FROM Tasks
	  WHERE id = @TaskId
	  UNION ALL
	  SELECT t.id, t.parent
	  FROM Tasks t INNER JOIN tree p on p.id = t.parent
	)

	DELETE FROM Tasks
	WHERE id in (SELECT id FROM tree);

END
