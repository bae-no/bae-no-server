# 배달비노노 서버

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

## fp-ts

프로젝트의 모든 어댑터 내부 로직은 `fp-ts` 를 사용하고 있습니다.  
`fp-ts` 는 `Either`, `Option` 과 같은 대수적 자료형을 지원하는 라이브러리로 `TaskEither` 를 주로 사용하고 있습니다.  
Repository 와 Service 구현체 내부의 메소들은 모두 순수함수로 이루어지며 Resolver 에서 side effect 가 발생하는 구조입니다.  
`fp-ts` 를 사용하다보면 `map`, `chain` 과 같은 함수의 이름이 중복되는 경우가 있어 보통 다음과 같은 축약어로 export 하여 사용합니다.

- TaskEither -> TE
- Either -> E
- Option -> O

```typescript
// libs/custom/src/fp-ts/index.ts
export * as TE from 'fp-ts/TaskEither';
export * as O from 'fp-ts/Option';
export * as E from 'fp-ts/Either';

// 아래와 같이 import 하여 사용
import { TE, O, E } from '@app/custom/fp-ts';
```

## Test

본 프로젝트는 resolver, service 영역은 유닛테스트 인프라 영역은 통합테스트를 수행합니다.  
통합테스트를 실행하기 위해 mongodb cluster 가 필요합니다.  
각 테스트를 수행하는 명령어는 다음과 같습니다.

```shell
pnpm test:unit # 유닛테스트
pnpm test:integration # 통합테스트
```

## 개발 관련 사항

### Enum 등록

TypeScript Enum 을 GraphQL Enum 으로 등록하기 위해 다음 파일을 수정해야 합니다.

- apps/app/src/module/category/adapter/in/gql/registerEnum.ts

```typescript
registerEnumType(MyEnum, { name: 'MyEnum', description: 'Eunm 설명' });
```

