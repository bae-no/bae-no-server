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

## 서버 실행

본 프로젝트는 패키지 매니저로 pnpm 을 사용합니다.  
다음 명령어를 수행해 의존성을 설치합니다.

```shell
pnpm install
```

`.env.sample` 파일을 `.env` 로 복사합니다.

```shell
cp .env.sample .env
```

다음 명령어를 실행합니다.

```shell
pnpm start
```
