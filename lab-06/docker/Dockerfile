FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY record/pom.xml record/pom.xml
RUN mvn -f record/pom.xml -B dependency:go-offline

COPY record/src record/src
RUN mvn -f record/pom.xml -B clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=builder /build/record/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
