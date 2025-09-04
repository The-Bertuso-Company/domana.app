-- ops/observability/pg_stat_statements.sql
-- Enable pg_stat_statements and a handy view for slowest queries
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE OR REPLACE VIEW top_slowest_queries AS
SELECT
  queryid,
  calls,
  total_exec_time,
  mean_exec_time,
  rows,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 50;
