package com.bidsync.backend.config;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final List<String> allowedOrigins;

    public WebConfig(@Value("${bidsync.cors.allowed-origins:${bidsync.websocket.allowed-origins:*}}") List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
    List<String> explicitOrigins = allowedOrigins.stream()
        .filter(origin -> !"*".equals(origin))
        .collect(Collectors.toList());

    registry.addMapping("/**")
        .allowedOrigins(explicitOrigins.toArray(String[]::new))
        .allowedOriginPatterns(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
