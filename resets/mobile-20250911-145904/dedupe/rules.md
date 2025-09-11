# Dedupe Rules (v0)

Signals (score adds up):
- +80 if external_source_id matches
- +40 if address distance < 15m (PostGIS)
- +20 if pHash Hamming distance <= 8 (images)
- +10 if same agent_id and |price delta| <= 1%
Merge decision: score >= 90.
Survivorship: prefer verified listings (see Step 10) else most recent updated_at.
