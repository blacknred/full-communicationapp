prod-build:
  docker-compose -f docker-compose.prod.yml build --no-cache
prod:
  docker-compose -f docker-compose.prod.yml up
dev:
  docker-compose -f docker-compose.yml up