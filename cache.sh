sudo chmod -R 777 .
sudo chown -R www-data:www-data .
echo "-+-+ Filesystem ownership changed to www-data -+-+"
#php bin/console cache:clear
./bin/console cache:clear --no-warmup && ./bin/console pimcore:cache:clear
echo "-+-+ File system cache cleared successfully -+-+"
sudo chmod 777 -R var/cache
sudo rm -rf var/sessions/*
echo "-+-+ Sessions removed -+-+"
sudo chmod 777 -R . 
