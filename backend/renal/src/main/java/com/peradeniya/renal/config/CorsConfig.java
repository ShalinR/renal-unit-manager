package com.peradeniya.renal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS is handled by SecurityConfig.corsConfigurationSource()
// This configuration is disabled to avoid conflicts
// @Configuration
// public class CorsConfig {
//
//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/api/**")
//                         .allowedOrigins("http://localhost:5173") // Your React app URL
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                         .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization",
//                             "X-Requested-With", "Access-Control-Request-Method",
//                             "Access-Control-Request-Headers")
//                         .allowCredentials(true);
//             }
//         };
//     }
// }