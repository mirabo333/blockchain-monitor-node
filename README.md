# BlockChain Sync Server Overview

## 소개

1. WebSocket 연결로 실시간 데이터 모니터일
2. 데이터 수집

- Block
- Transaction
- Receipt

3. Prisma ORM을 통한 SQLite에 저장
4. Winston logger로 모니터링

## Key Features

- 실시간 블록체인 데이터 동기화
- 자동 재연결 및 에러 복구
- BigInt 데이터 자동 변환
- 구조화된 데이터 저장
- 로깅 및 모니터링

## 기술 스택

- TypeScript
- Web3.js
- Prisma ORM
- SQLite
- Winston Logger

## 시작하기

### 환경 설정

저장소 클론
의존성 설치
환경 변수 설정
데이터베이스 마이그레이션

### 실행

#### 개발 모드:

```
# 실시간 코드 변경 감지
npm run watch

# 단순 개발 모드 실행
npm run dev
```

#### 프로덕션 모드:

```
# 빌드
npm run build

# 실행
npm start
```

## 데이터 구조

### Block

- 블록 번호, 해시, 타임스탬프 등 블록 기본 정보
- 트랜잭션 목록
- 가스 사용량 및 제한량

### Transaction

- 트랜잭션 해시, 블록 정보
- 송신자/수신자 주소
- 가스 가격 및 사용량
- 입력 데이터

### Receipt

- 트랜잭션 실행 결과
- 로그 데이터
- 컨트랙트 주소 (컨트랙트 생성 시)
- 가스 사용량

---

## PRISMA 사용 방법

#### 초기화

```
npx prisma init
```

#### 마이그레이션

```
# 마이그레이션 생성
npx prisma migrate dev --name init

# 마이그레이션 적용
npx prisma migrate deploy
```

#### 클라이언트 생성

```
# 타입 생성 및 클라이언트 코드 생성
npx prisma generate
```

#### DB 동기화

```
# 개발/테스트 환경(빠른 반영)
npx prisma db push
# 스키마 변경 사항을 바로 DB에 반영하지만, 마이그레이션 히스토리는 남기지 않는다.

# 프로덕션 환경(버전 관리가 필요한 경우)
npx prisma migrate dev --name initial
npx prisma migrate deploy
```
