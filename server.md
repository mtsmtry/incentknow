# 接続
chmod 600 Incentknow.cer
ssh -i Incentknow.cer ubuntu@13.113.194.38

ssh -i ~/.ssh/id_rsa ryoui@34.146.76.189
ssh 34.146.76.189

# MySQLインストール
sudo apt-get update
sudo apt-get install docker.io
sudo apt install docker-compose

sudo apt install mysql-server mysql-client

sudo apt install apache2

# ファイアーウォールの設定
https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-ja
sudo ufw app list 
sudo ufw allow 'Apache'
sudo ufw enable
sudo ufw status

sudo chown -R root:root /home/ryoui/incentknow

sudo chown -R $USER:$USER /home/ryoui/incentknow
sudo chmod -R 755 /home/ryoui/incentknow

sudo chown -R apache:apache /home/ryoui/incentknow

ll /var/www/incentknow.com
ll /home/ryoui/incentknow/frontend/public

sudo nano /home/ryoui/incentknow/frontend/public/index.html

sudo nano /etc/apache2/sites-available/incentknow.com.conf
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName incentknow.com
    ServerAlias www.incentknow.com
    DocumentRoot /var/www/incentknow.com
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
sudo a2ensite incentknow.com.conf

sudo systemctl restart apache2

# GitHub SSH接続
https://blog.katsubemakito.net/git/github-ssh-keys

git clone git@github.com:mtsmtry/incentknow.git

# docker-composeをdockerに接続できるようにする
sudo usermod -aG docker $USER
ログアウト

mysql -u docker --port 3306 -h 13.113.194.38 -ppassword incentknow
mysql -u root --port 3306 -h localhost -ppassword incentknow

show variables like '%char%';

# 起動確認
mysqladmin ping -u docker -p
# 起動
mysql.server start



ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';


# MySQL User
user: root
pass: 21280712