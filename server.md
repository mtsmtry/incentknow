# 接続
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

# Appacheの設定
- 権限設定
sudo chown -R $USER:$USER /home/ryoui/incentknow
sudo chmod -R 755 /home/ryoui/incentknow
- 権限確認
ll /var/www/incentknow.com
ll /home/ryoui/incentknow/frontend/public
- 設定する(上位設定のDocumentRootに制約されるためDocumentRootは/var/wwwの配下にする)
sudo nano /etc/apache2/sites-available/incentknow.com.conf
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName incentknow.com
    ServerAlias www.incentknow.com
    DocumentRoot /var/www/incentknow.com
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

- 有効化
sudo a2ensite incentknow.com.conf
- 再起動
sudo systemctl restart apache2

# GitHub SSH接続
https://blog.katsubemakito.net/git/github-ssh-keys
git clone git@github.com:mtsmtry/incentknow.git

# データベースへの接続
- ローカルから接続する(GCPのファイアーウォールとuwfで3306を許可する)
mysql -u docker --port 3306 -h 34.146.76.189 -p21280712 incentknow
- サーバー内で接続する
mysql -u docker --port 3306 -h 0.0.0.0 -p21280712

# データベースのコピー
mysqldump -u root -ppassword incentknow > dbdump.sql
- dbdump.sqlのutf8mb4_0900_ai_ciをutf8mb4_unicode_ciに置き換える
mysql -u docker -h 34.146.76.189 -p21280712 incentknow < dbdump.sql

# APIテスト
curl -sS -w '\n' -X POST 'localhost:8081/getPublishedSpaces' --data '[]' -XPOST
curl -sS -w '\n' -X POST '0.0.0.0:8081/getPublishedSpaces' --data '[]' -XPOST