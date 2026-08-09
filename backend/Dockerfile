# Etapa de construcción
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compilamos el proyecto omitiendo los tests para que sea más rápido
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/parcial3pa-0.0.1-SNAPSHOT.jar app.jar
# Exponemos el puerto
EXPOSE 8080
# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
