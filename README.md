# 배달비노노 서버

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bae-no_bae-no-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=bae-no_bae-no-server)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=bae-no_bae-no-server&metric=coverage)](https://sonarcloud.io/summary/new_code?id=bae-no_bae-no-server)
[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

## 개발 스택

- Nest.JS
- GraphQL
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

`.env` 파일을 수정해 환경변수를 설정합니다.  
필수로 넣어야 하는 값은 다음과 같습니다.

```dotenv
JWT_EXPIRE_DAYS="30" # jwt 만료일자
JWT_SECRET="random secret" # jwt 시크릿

# FIREBASE 정보
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

다음 명령어를 실행해 prisma schema 를 생성합니다.

```shell
pnpm prisma:generate
```

다음 명령어를 실행합니다.

```shell
pnpm start
```

## 프로젝트 구조

본 프로젝트는 헥사고날 아키텍쳐로 불리는 포트와 어댑터 패턴을 사용합니다.  
디렉토리 구조는 `만들면서 배우는 클린아키텍쳐` 서적을 참고해서 만들었습니다.  
`apps/app/src/module/sample` 디렉토리를 참고하면 파일구조와 네이밍에 대한 규칙을 확인할 수 있습니다.

```text
sample
├── SampleModule.ts
├── adapter
│   ├── in
│   │   └── gql
│   │       ├── SampleMutationResolver.ts
│   │       ├── SampleQueryResolver.ts
│   │       ├── SampleSubscriptionResolver.ts
│   │       ├── input
│   │       │   └── CreateSampleInput.ts
│   │       └── response
│   │           └── SampleResponse.ts
│   └── out
│       └── persistence
│           ├── SampleOrmMapper.ts
│           ├── SampleQueryRepositoryAdapter.ts
│           └── SampleRepositoryAdapter.ts
├── application
│   ├── port
│   │   ├── in
│   │   │   ├── SampleCommandUseCase.ts
│   │   │   ├── SampleQueryUseCase.ts
│   │   │   └── dto
│   │   │       └── CreateSampleCommand.ts
│   │   └── out
│   │       ├── SampleQueryRepositoryPort.ts
│   │       └── SampleRepositoryPort.ts
│   └── service
│       ├── SampleCommandService.ts
│       └── SampleQueryService.ts
└── domain
    └── Sample.ts
```

### libs

`libs` 디렉토리는 각 모듈에서 공통으로 사용하는 코드를 모아둔 곳입니다.  
`domain` 디렉토리에는 자주 사용되는 커스텀 에러클래스나 외부 인프라 영역에 대한 인터페이스가 있습니다.  
그 외 디렉토리는 `domain` 에 선언된 인터페이스의 구현체가 존재합니다.

각 디렉토리에는 Nest.js 모듈파일이 존재하며 보통 다음과 같은 내용이 들어갑니다.

```typescript
@Module({
  providers: [
    {
      provide: SmsPort, // domain 에 선언된 인터페이스
      useClass: SmsSensService, // port 인터페이스를 구현한 adapter
    },
  ],
  imports: [HttpClientModule], // 추가로 필요한 모듈선언
  exports: [SmsPort], // 각 모듈에서 사용되는 인터페이스를 export
})
export class SmsModule {
}
```

본래 `SmsPort` 와 같은 항목은 인터페이스로 선언하지만 java 와 달리 typescript 는 interface 가 트랜스파일 결과에 포함되지 않는 문제가 있습니다.  
따라서 Nest.js 의 Provider 에 등록할 수 없기에 `abstrace class` 로 선언해야 합니다.

```typescript
export abstract class SmsPort {
  abstract send(
    phoneNumber: string,
    content: string,
  ): TaskEither<NotificationError, void>;
}
```

## Effect TS

프로젝트의 모든 내부 로직은 `Effect TS` 를 사용하고 있습니다.  
`Effect TS` 는 `Either`, `Option` 과 같은 대수적 자료형을 제공하며, 추가로 사이드 이팩트를 효과적으로 다루는 `Effect` 자료형을 제공합니다.  
`Effect` 는 의존성에 대한 파라미터를 제공하지만 로깅 외에는 사용하지 않으며 오직 성공과 실패를 표현하는 용도로 사용합니다.  

소스코드에서 해당 라이브러리를 직접 사용하는 대신 커스텀 라이브러리 모듈에서 다시 export 한 것을 사용합니다.  
보통 라이브러리 관례에 따라 다음과 같은 축약 표현을 사용합니다.

- Effect -> T
- Either -> E
- Option -> O
- NonEmptyArray -> NEA

```typescript
// libs/custom/src/effect/index.ts
export * as T from '@effect-ts/core/Effect';
export * as O from '@effect-ts/core/Option';
export * as E from '@effect-ts/core/Either';
export * as NEA from '@effect-ts/core/Collections/Immutable/NonEmptyArray';

// 아래와 같이 import 하여 사용
import { T, O, E, NEA } from '@app/custom/effect';
```

> Effect TS 에 대한 자세한 내용은 [블로그 글](https://jbl428.github.io/2023/02/11/Effect-TS%EB%A1%9C-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B0%80%EB%8A%A5%ED%95%98%EA%B3%A0-%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0) 을 참고하세요.

## Test

본 프로젝트는 resolver, service 영역은 유닛테스트 인프라 영역은 통합테스트를 수행합니다.  
통합테스트를 실행하기 위해 mongodb cluster 가 필요합니다.  
각 테스트를 수행하는 명령어는 다음과 같습니다.

```shell
pnpm test:unit # 유닛테스트
pnpm test:integration # 통합테스트
```

## Monitoring

본 프로젝트는 `open-telemetry` 를 사용하여 trace 정보를 수집합니다.  
`docker-compose.yml` 파일에 jaeger 서버가 포함되어 있으며 `pnpm start` 명령어를 통해 서버를 실행하면 jaeger 서버에 trace 정보가 수집됩니다.  
`http://localhost:16686` 으로 접속하여 trace 정보를 확인할 수 있습니다.

## 개발 관련 사항

### Enum 등록

TypeScript Enum 을 GraphQL Enum 으로 등록하기 위해 다음 파일을 수정해야 합니다.

- apps/app/src/module/category/adapter/in/gql/registerEnum.ts

```typescript
registerEnumType(MyEnum, { name: 'MyEnum', description: 'Eunm 설명' });
```

### schema.gql 업데이트

본 프로젝트는 Nest.js code first 방식으로 GraphQL 스키마를 관리하고 있습니다.  
`pnpm start`를 통해 서버를 실행하면 `schema.gql`파일이 자동으로 업데이트됩니다.  
하지만 db를 실행해야 하는 번거로움이 있으므로 아래 명령어를 통해 쉽게 업데이트 할 수 있습니다.

해당 명령어는 `AppModule.spec.ts`테스트 파일을 실행하며 서버를 디비없이 실행하게 됩니다.  
이 테스트는 각 의존성을 제대로 주입했는지 확인하는 용도로도 사용할 수 있습니다.

```shell
pnpm graphql:schema
```
