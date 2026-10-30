FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY wired/pom.xml wired/pom.xml
RUN mvn -f wired/pom.xml -B dependency:go-offline

COPY wired/src wired/src
RUN mvn -f wired/pom.xml -B clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=builder /build/wired/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]