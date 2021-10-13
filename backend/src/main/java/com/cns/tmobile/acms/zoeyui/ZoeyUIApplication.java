package com.cns.tmobile.acms.zoeyui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;


@SpringBootApplication
@Slf4j
@Controller
@ComponentScan(basePackages = {"com.cns.tmobile.acms"})
public class ZoeyUIApplication extends SpringBootServletInitializer implements WebApplicationInitializer,
        ErrorController {

    public static void main(String[] args) {
        SpringApplication.run(ZoeyUIApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ZoeyUIApplication.class);
    }

    private static final String PATH = "/error";


    @RequestMapping(value = PATH)
    @ResponseStatus(value = HttpStatus.OK)
    public String error() {
        log.info("admin-ui | redirecting to forward:/");
        return "forward:/";
    }


    @Override
    public String getErrorPath() {
        return PATH;
    }
}