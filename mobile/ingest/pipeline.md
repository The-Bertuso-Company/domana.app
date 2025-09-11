# Ingest Pipeline (ETL)

Stages: extract → validate → transform → dedupe → upsert → postprocess
- **extract**: source -> raw records
- **validate**: JSON Schema (listing.v1)
- **transform**: map columns/fields -> canonical listing
- **dedupe**: call SQL helpers (see 007_dedupe.sql)
- **upsert**: insert/update listing + address + media_set
- **postprocess**: compute H3, enqueue media renditions

Batch metrics: per-stage counts, errors, DLQ file.

