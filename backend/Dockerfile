# 1. Use the correct Java 21 base image
FROM eclipse-temurin:21-jdk-jammy

# 2. Set the working directory
WORKDIR /app

# 3. Copy *only* the build files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

# 4. Give Gradle permission to run
RUN chmod +x ./gradlew

# 5. Download dependencies (This is a cache optimization)
# This downloads libraries *before* copying your code.
# Future builds will re-use these libraries unless your build.gradle changes.
RUN ./gradlew dependencies --no-daemon

# 6. Copy your source code (THIS IS THE FIX)
# Now we copy the actual code to be built.
COPY src ./src

# 7. Build the application
RUN ./gradlew bootJar --no-daemon

# The app jar will be in build/libs/
# Set the entrypoint to run the jar
# IMPORTANT: Check your real .jar file name and update this line
ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]