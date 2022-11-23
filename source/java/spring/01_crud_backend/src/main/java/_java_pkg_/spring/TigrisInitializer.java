package {{.PackageName}}.spring;

import com.tigrisdata.db.client.TigrisClient;
import com.tigrisdata.db.client.TigrisDatabase;
import {{.PackageName}}.collections.Order;
import {{.PackageName}}.collections.Product;
import {{.PackageName}}.collections.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;

public class TigrisInitializer implements CommandLineRunner {

  private final TigrisClient tigrisClient;
  private final String projectName;

  private static final Logger log = LoggerFactory.getLogger(TigrisInitializer.class);

  public TigrisInitializer(TigrisClient tigrisClient, String projectName) {
    this.tigrisClient = tigrisClient;
    this.projectName = projectName;
  }

  @Override
  public void run(String... args) throws Exception {
    log.info("get database db: {}", projectName);
    TigrisDatabase tigrisDatabase = tigrisClient.getDatabase();
    log.info("creating collections on db {}", projectName);
    tigrisDatabase.createOrUpdateCollections(
{{- $first := true -}}
{{- range .Collections}}
    {{- if $first}}{{$first = false}}{{else}},{{end}}
            {{.Name}}.class
{{- end}}
    );
    log.info("Finished initializing Tigris");
  }
}
