package cn.edu.scnu.peripheraltradingplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.FlushMode;
import org.springframework.session.MapSession;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@EnableRedisHttpSession(maxInactiveIntervalInSeconds = MapSession.DEFAULT_MAX_INACTIVE_INTERVAL_SECONDS,
        redisNamespace = "spring:session",
        flushMode = FlushMode.ON_SAVE)
@SpringBootApplication
public class PeripheralTradingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(PeripheralTradingPlatformApplication.class, args);
    }

}
