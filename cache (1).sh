sudo chmod -Rf 777 ./
php bin/console cache:clear
sudo chmod -Rf 777 ./
php bin/console asset:install public --symlink --relative
sudo chown -R www-data:www-data ./
sudo chmod -Rf 777 ./
php bin/console pimcore:cache:clear
