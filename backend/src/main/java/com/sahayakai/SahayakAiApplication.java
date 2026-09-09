package com.sahayakai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SahayakAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SahayakAiApplication.class, args);
    }
}
