FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY blog/pom.xml blog/pom.xml
RUN mvn -f blog/pom.xml -B dependency:go-offline

COPY blog/src blog/src
RUN mvn -f blog/pom.xml -B clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=builder /build/blog/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]