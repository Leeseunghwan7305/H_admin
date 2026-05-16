# Admin 프로젝트

개인 관리자 웹앱. 단백질 추적 + 급여 관리.

## 스택

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Spring Boot 3.5.0, Java 17, JPA/Hibernate, Lombok |
| DB | Supabase (PostgreSQL) |
| API | REST, Axios (proxy: `/api` → `localhost:8080`) |

## 서버 실행

```bash
# 백엔드 (포트 8080)
cd backend && ./gradlew bootRun

# 프론트엔드 (포트 5173)
cd frontend && npm run dev
```

## 디렉토리 구조

```
admin/
  backend/src/main/java/com/admin/
    AdminApplication.java          ← @EnableJpaAuditing 있음
    global/
      config/CorsConfig.java
      entity/BaseEntity.java       ← createdAt, updatedAt 자동 관리
      exception/
        ErrorCode.java             ← 에러 enum 여기에 추가
        BusinessException.java
        ErrorResponse.java         ← record
        GlobalExceptionHandler.java
    domain/{protein,salary,setting}/
      controller/                  ← HTTP 처리만, 비즈니스 로직 없음
      service/                     ← @Transactional(readOnly=true) 기본
      repository/                  ← JpaRepository 상속
      entity/                      ← @Builder, setter 없음
      dto/
        request/                   ← record 사용
        response/                  ← record + static from(Entity) 팩토리

  frontend/src/
    api/index.ts                   ← 모든 API 호출 여기서 관리
    components/BottomNav.tsx
    pages/{ProteinPage,SalaryPage,SettingsPage}.tsx
```

## 코드 컨벤션

### Backend
- Entity: `@Builder` + `@NoArgsConstructor` + setter 금지 → 수정은 `update()` 메서드
- Service: 클래스 레벨 `@Transactional(readOnly = true)`, 쓰기 메서드에만 `@Transactional`
- DTO: Java `record` 사용. Response는 `static from(Entity)` 팩토리 메서드
- 예외: `BusinessException(ErrorCode.NOT_FOUND)` 형태로 던지기
- 새 도메인 추가 시 `domain/` 아래에 동일 구조로 생성

### Frontend
- API 호출은 `src/api/index.ts` 에서만
- 애니메이션: Framer Motion (`motion.div`, `AnimatePresence`)
- 스타일: Tailwind utility, 카드는 `rounded-3xl shadow-sm bg-white`
- 컬러: 단백질=핑크(`pink-400`), 급여=보라(`violet-400`), 설정=초록(`emerald-400`)

## API 엔드포인트

```
GET    /api/protein              오늘 단백질 기록
GET    /api/protein/date/{date}  날짜별 기록
POST   /api/protein              기록 추가
DELETE /api/protein/{id}         기록 삭제

GET    /api/salary               전체 급여 목록
POST   /api/salary               급여 추가
PUT    /api/salary/{id}          급여 수정
DELETE /api/salary/{id}          급여 삭제

GET    /api/settings/{key}       설정값 조회
POST   /api/settings             설정값 저장
```

## 에이전트 사용 가이드

| 상황 | 방법 |
|---|---|
| 특정 파일/심볼 찾기 | Bash `grep`/`find` 직접 사용 (빠름) |
| 범위 불확실한 탐색 | `Explore` 에이전트 (medium) |
| 새 도메인 전체 구현 | 메인 컨텍스트에서 직접 (파일 많아도 괜찮음) |
| 프론트/백엔드 동시 작업 | 에이전트 2개 병렬 실행 |
| 단순 수정 1-2줄 | 에이전트 X, 바로 Edit |

### 탐색 쿼리 예시
```bash
# 특정 클래스 찾기
grep -r "ProteinService" backend/src --include="*.java" -l

# API 엔드포인트 전체 보기
grep -r "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" backend/src --include="*.java"

# 프론트 컴포넌트 찾기
find frontend/src -name "*.tsx" | xargs grep -l "useState"
```
