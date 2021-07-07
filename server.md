# 接続
chmod 600 Incentknow.cer
ssh -i Incentknow.cer ubuntu@13.113.194.38

# MySQLインストール
sudo apt-get update
sudo apt-get install docker.io
sudo apt install docker-compose

sudo apt install mysql-server mysql-client

# GitHub SSH接続
https://blog.katsubemakito.net/git/github-ssh-keys

# docker-composeをdockerに接続できるようにする
sudo usermod -aG docker $USER
ログアウト

mysql -u docker --port 3306 -h 13.113.194.38 -ppassword incentknow
