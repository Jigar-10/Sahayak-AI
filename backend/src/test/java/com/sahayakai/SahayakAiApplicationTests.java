package com.sahayakai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.data.mongodb.uri=mongodb://localhost:27017/sahayak_ai_test"
})
class SahayakAiApplicationTests {

    @Test
    void contextLoads() {
    }
}
