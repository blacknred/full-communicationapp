prod-build: ##
	docker-compose -f docker-compose.prod.yml build --no-cache $(c)

prod: ##
	docker-compose -f docker-compose.prod.yml up $(c)

dev: ##
	docker-compose -f docker-compose.yml up $(c)