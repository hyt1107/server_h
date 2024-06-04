#!/bin/bash

# 定义变量
CONTAINER_NAME="mysql_container"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./databackup"
DB_USER="root"
DB_PASSWORD="root"
#DB_USER="myuser"
#DB_PASSWORD="holdwell527"
DB_NAME="holdwell_test"

# 如果备份目录不存在，则创建它
mkdir -p $BACKUP_DIR

# 导出数据库
#mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql
docker exec $CONTAINER_NAME mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql