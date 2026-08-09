package edu.progavud.parcial3pa;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtenemos la ruta absoluta de la carpeta postImages
        String postImagesPath = new File("postImages").getAbsolutePath();
        if (!postImagesPath.endsWith(File.separator)) {
            postImagesPath += File.separator;
        }

        registry.addResourceHandler("/images/posts/**")
                .addResourceLocations("file:" + postImagesPath);
    }
}
