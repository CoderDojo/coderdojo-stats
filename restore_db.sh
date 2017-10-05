#!/usr/bin/env bash

declare -a repos=("dojos"
                  "events"
                  "users")
for repo in "${repos[@]}"; do
  tar xvf /db/zen"$repo"prod-*.tar -C /db
  createdb "cp-""$repo""-development" -U platform
  pg_restore -c --if-exists -d "cp-""$repo""-development" -U platform /db/backup_dump
  rm -rf /db/backup_dump
done
