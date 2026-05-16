# ── 빌드 스테이지 ──────────────────────────────────────
FROM gradle:8.12-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon -x test

# ── 런타임 스테이지 (JRE만, 이미지 최소화) ────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
