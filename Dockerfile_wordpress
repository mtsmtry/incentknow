FROM wordpress:latest

# set recommended PHP.ini settings
RUN { \
  echo 'max_execution_time=-1'; \
  echo 'memory_limit=-1'; \
  echo 'post_max_size=-1'; \
  echo 'upload_max_filesize=100M'; \
} > /usr/local/etc/php/conf.d/wp-recommended.ini