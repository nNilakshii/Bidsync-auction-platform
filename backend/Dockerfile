# Use an official OpenJDK 17 runtime as a parent image
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle wrapper files
COPY gradlew .
COPY gradle ./gradle

# Copy the build file
COPY build.gradle .
COPY settings.gradle .

# Grant execute permission to the gradlew script
RUN chmod +x ./gradlew

# Build the application
# We use --no-daemon because it's running in a container
RUN ./gradlew bootJar --no-daemon

# The app jar will be in build/libs/
# Set the entrypoint to run the jar
# IMPORTANT: Check your real .jar file name and update this line
ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]