# Supabase Setup

이 프로젝트의 새 Supabase를 만들 때는 아래 순서로 가면 됩니다.

## 1. 프로젝트 생성

- 새 Supabase 프로젝트 생성
- `Project Settings -> API`에서 아래 값 확보
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 2. SQL 실행

- Supabase SQL Editor 열기
- [SUPABASE_SETUP.sql](/Users/insung/Dev/plander_chn_manager/SUPABASE_SETUP.sql) 전체 실행

이 SQL에는 아래가 포함되어 있습니다.

- 앱이 사용하는 모든 기본 테이블
- enum 타입
- 인덱스
- `updated_at` 트리거
- RLS 정책
- storage bucket 3개
  - `contracts`
  - `payments`
  - `reports`
- 초기 설정값
  - `apify_actor_id`
  - `cny_to_krw_rate`
- 기본 `client_options` 시드

## 3. 첫 관리자 계정 만들기

앱의 관리자 생성 기능은 로그인된 사용자 상태가 필요합니다.

그래서 첫 계정은 Supabase에서 직접 하나 만들어두는 게 가장 빠릅니다.

### Auth 사용자 생성

- `Authentication -> Users`에서 유저 1명 생성
- 이메일 인증은 완료 상태로 생성

### admins 테이블 연결

생성된 auth user의 `id`를 복사해서 아래 SQL 실행:

```sql
insert into public.admins (id, name, email, company, title)
values (
  'AUTH_USER_UUID_HERE',
  'Owner',
  'owner@example.com',
  'Plander China',
  'Admin'
);
```

## 4. 앱 env 연결

프로젝트 루트의 `.env.local`에 아래 값 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 5. 확인 포인트

- 로그인 가능
- `/extras/admins` 접속 가능
- 관리자 추가 가능
- 파일 업로드 가능
  - 계약서
  - 입금 증빙
  - PDF 리포트
- `/extras/stats`에서 환율 반영 확인

## 주의

- 이 앱은 내부 관리자용이라 현재 RLS 정책이 `authenticated` 사용자 전체 허용 형태입니다.
- 운영 안정화 단계에서는 관리자 권한 체크를 더 좁히는 방향으로 다시 다듬는 게 좋습니다.
