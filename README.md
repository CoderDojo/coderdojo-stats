# This script is deprecated in favour of Google Data Studios

# CoderDojo-stats

## Run

To generate stats run the following commands

```
docker-compose down -v
docker-compose build
docker-compose up db
# ensure db is running ...
docker-compose up stats
```

This will run the default `get-stats` argument modify the command arguments to
generate relevant stats.

Make sure to have db dumps called `users`, `dojos`, `events` in the dump folder
