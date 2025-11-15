package com.peradeniya.renal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    // CORS is handled by SecurityConfig.corsConfigurationSource()
    // Disabling duplicate CORS configuration to avoid conflicts
    // @Value("${cors.allowed-origins}")
    // private String allowedOrigins;

    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     registry.addMapping("/api/**")
    //             .allowedOrigins(allowedOrigins)
    //             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
    //             .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization",
    //                 "X-Requested-With", "Access-Control-Request-Method",
    //                 "Access-Control-Request-Headers")
    //             .allowCredentials(true);
    // }
}