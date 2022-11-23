package {{.PackageName}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class {{.ProjectNameCamel}}Application {

  public static void main(String[] args) {
    new SpringApplication({{.ProjectNameCamel}}Application.class).run(args);
  }
}
