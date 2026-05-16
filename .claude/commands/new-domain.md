새 도메인을 추가한다. 인자: $ARGUMENTS (도메인 이름, 예: `exercise`)

아래 구조를 그대로 따라 생성한다. 기존 protein 도메인을 참고 패턴으로 사용한다.

1. 먼저 사용자에게 Entity 필드를 물어본다.
2. 확인 후 아래 파일들을 한 번에 생성한다:

**Backend** (`domain/{name}/`):
- `entity/{Name}.java` — BaseEntity 상속, @Builder, setter 없음
- `dto/request/{Name}CreateRequest.java` — record
- `dto/response/{Name}Response.java` — record + static from()
- `repository/{Name}Repository.java` — JpaRepository 상속
- `service/{Name}Service.java` — @Transactional(readOnly=true)
- `controller/{Name}Controller.java` — /api/{name} 매핑

**Frontend** (`pages/{Name}Page.tsx`):
- 해당 도메인 색상 테마 지정 (기존 핑크/보라/초록 제외 색상)
- 기본 목록 + FAB + 바텀시트 모달 구조

생성 후 `/check` 로 컴파일 확인.
