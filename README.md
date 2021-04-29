# RERADME #

## Inventory management SaaS using Django & React
This is inventory management SaaS which provide below services 
+ Dashboard
+ User management
+ Product(variant) management
+ Sku management
+ Media management using cloudinary
+ Order management
+ Sync products and other info with shopify, Magento, zudello, zapier, amazon, quickbooks

This project developed with Python3.65+ Django for Backend and Angular7.0 for Frontend

#### Preview
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img1.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img2.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img3.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img4.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img5.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img6.PNG)
![Relevance feedback image](https://github.com/certainty15750/tradegecko/blob/master/Screenshots/img7.PNG)


## SERVER ENVIRONMENT SETUP (Ubuntu18.04)
Here I described way to deploy to VPS server manually

 + Frontend(React)
    + node
        + `curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -`
        + `sudo yum install nodejs`
    + npm
        + `npm install`
        + `npm start`
 + Backend(Django)
    + python
        + `sudo yum -y install https://centos7.iuscommunity.org/ius-release.rpm`
        + `sudo yum -y install python36u`
        + `python3.6 -V`
    + pip
        + `sudo yum -y install python36u-pip`
        + `pip3.6 install --upgrate pip`
    + virtual env
        + `pip3.6 install virtualenv`
        + `virtualenv venv`
    + project
        + `source venv/bin/activate`
        + `pip install -r requirement.txt`
+ Database(postgresql 10.0)
    + install
        + `rpm -Uvh https://yum.postgresql.org/10/redhat/rhel-7-x86_64/pgdg-centos10-10-2.noarch.rpm`
        + `yum install postgresql10-server postgresql10`
        + `/usr/pgsql-10/bin/postgresql-10-setup initdb`
    + Start PostgreSQL Server
        + `ystemctl start postgresql-10.service`
        + `systemctl enable postgresql-10.service`
 
    
 + Service   
    + frontend
        + create the service named frontend (port: 4200)\
        `sudo nano /etc/systemd/system/frontend.service`

            ```
            [Unit]
            Description=Serve for swivel frontend
            After=network.target

            [Service]
            User=root
            WorkingDirectory=/root/Caleo/frontend
            ExecStart=/usr/bin/npm start

            [Install]
            WantedBy=multi-user.target
            ```
        + start, restart, deamon-reload, stop, status
            ```
            sudo systemctl start frontend
            sudo systemctl restart frontend
            sudo systemctl stop frontend
            sudo systemctl status frontend
            sudo systemctl deamon-relaod
            ``` 
    + Backend
        + create the service named backend
            + `pip install gunicorn`
            + `pip install eventlet`
            + `sudo nano /etc/systemd/system/backend.service`

                ```
                [Unit]
                Description=Gunicorn instance to serve swivel
                After=network.target
                
                [Service]
                User=root
                WorkingDirectory=/root/Caleo/backend
                Environment="PATH=/root/Caleo/backend/venv/bin"
                ExecStart=/root/Caleo/backend/venv/bin/gunicorn -w 3 --bind 0.0.0.0:8080 backend.wsgi
                [Install]
                WantedBy=multi-user.target
                ```
        + start, restart, deamon-reload, stop, status
            ```
            sudo systemctl start backend
            sudo systemctl restart backend
            sudo systemctl stop backend
            sudo systemctl status backend
            sudo systemctl deamon-reload
            ```
    + nginx
        + install
            + `sudo yum install epel-release`
            + `sudo yum install nginx`
            + `sudo nano /etc/nginx/nginx.conf`
            + disabled server block
        + config
            + `sudo nano /etc/nginx/conf.d/swivel.conf`
            ```
            server {
             listen 80;
             server_name swivel.net;
             location / {
                 include proxy_params;
                 proxy_pass http://localhost:4200;
             }
             location /api/ {
                 include proxy_params;
                 proxy_pass http://localhost:8080/api/;
             }
            }
            
            ```
