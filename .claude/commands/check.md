백엔드 컴파일과 프론트엔드 타입을 동시에 체크한다.

1. 백엔드: `cd /Users/seunghwan/Desktop/admin/backend && ./gradlew compileJava 2>&1 | grep -E "error:|BUILD (SUCCESS|FAILED)"` 실행 후 결과 출력
2. 프론트엔드: `cd /Users/seunghwan/Desktop/admin/frontend && npx tsc --noEmit 2>&1` 실행 후 결과 출력
3. 두 작업을 병렬로 실행해 결과를 각각 보여준다.
4. 에러가 있으면 어느 쪽인지 명확히 알려주고 수정 방향을 제시한다.
