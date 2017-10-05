FROM postgres
LABEL maintainer='butlerx <cian@coderdojo.org>'
ENV POSTGRES_USER=platform POSTGRES_PASSWORD=QdYx3D5y
COPY dump /db
RUN chown -R postgres:postgres /db
COPY restore_db.sh /docker-entrypoint-initdb.d
