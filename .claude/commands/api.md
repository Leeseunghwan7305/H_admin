현재 백엔드의 모든 API 엔드포인트를 보여준다.

`grep -rn "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping\|@RequestMapping" /Users/seunghwan/Desktop/admin/backend/src --include="*.java"` 를 실행해서 결과를 도메인별로 정리해 표로 보여준다.

형식: `METHOD | 경로 | 컨트롤러:라인번호` 형태로 출력.
