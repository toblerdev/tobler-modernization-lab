
#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BASELINE="${PROJECT_ROOT}/sql/demo/baseline.sql"

DATABASE="${1:-}"

timestamp() {
  date -u '+%Y-%m-%dT%H:%M:%SZ'
}

log() {
  echo "[$(timestamp)] $*"
}

error() {
  log "ERROR: $*" >&2
  exit 1
}

trap 'log "ERROR: Demo reset failed" >&2' ERR

# Restrict database targets.
case "$DATABASE" in
  tml_demo_restore_test)
    ;;
  modernization_lab)
    [[ "${ALLOW_LIVE_RESET:-}" == "YES" ]] ||
      error "Live reset requires ALLOW_LIVE_RESET=YES"
    ;;
  *)
    error "Database not permitted: $DATABASE"
    ;;
esac

[[ -s "$BASELINE" ]] ||
  error "Baseline missing or empty: $BASELINE"

log "Starting TML demo reset: $DATABASE"

{
  echo "BEGIN;"

  # Prevent simultaneous executions of this reset script.
  echo "SELECT pg_advisory_xact_lock(570057);"

  echo "TRUNCATE TABLE
    crm.outreach_events,
    crm.campaign_rule_overrides,
    crm.contacts,
    crm.companies,
    crm.campaigns,
    crm.recommendation_rules;"

  cat "$BASELINE"

  # Validate the restored dataset before committing.
  cat <<'SQL'
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM crm.companies) <> 105
     OR (SELECT COUNT(*) FROM crm.contacts) <> 25
     OR (SELECT COUNT(*) FROM crm.campaigns) <> 4
     OR (SELECT COUNT(*) FROM crm.outreach_events) <> 3
     OR (SELECT COUNT(*) FROM crm.recommendation_rules) <> 5
     OR (SELECT COUNT(*) FROM crm.campaign_rule_overrides) <> 1
  THEN
    RAISE EXCEPTION 'TML demo reset validation failed';
  END IF;
END
$$;
SQL

  echo "COMMIT;"

} | psql -X -q -v ON_ERROR_STOP=1 -d "$DATABASE"

log "Demo data reset completed successfully"
