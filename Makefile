prod-build: ##
	docker-compose -f docker-compose.prod.yml build --no-cache $(c)

prod: ##
	./init-letsencrypt.sh

dev: ##
	docker-compose -f docker-compose.yml up $(c)

stop: ##
	docker-compose -f docker-compose.yml stop $(c)