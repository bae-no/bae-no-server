# 배달비노노 서버

## 개발 스택

- Nest.JS
- MongoDB
- Prisma

## 디비 실행

로컬 개발을 위해 mongodb replica set 이 필요합니다.  
아래 명령어를 수행해서 mongodb 컨테이너를 생성합니다.

```shell
docker-compose up -d
```

localhost 주소로 접근하기 위해서는 아래 명령어를 최초 한번 수행해야 합니다.

```shell
echo '127.0.0.1 mongo1' | sudo tee -a /etc/hosts
echo '127.0.0.1 mongo2' | sudo tee -a /etc/hosts
echo '127.0.0.1 mongo3' | sudo tee -a /etc/hosts
```
