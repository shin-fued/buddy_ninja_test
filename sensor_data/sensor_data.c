#include <stdio.h>
#include <time.h>
#include <curl/curl.h>
#include <unistd.h>

int sensor_data() {
    CURL *curl;
    CURLcode res;
    // Prepare date/time
    time_t now = time(NULL);
    struct tm *tm_info = localtime(&now);
    char datetime[30];
    strftime(datetime, sizeof(datetime), "%Y-%m-%dT%H:%M:%SZ", tm_info); // ISO 8601

    // Prepare JSON string
    char json_data[256];  // Make sure it's large enough
    double latitude = 37.7749;
    double longitude = -122.4194;
    int battery = 85;

    sprintf(json_data,
        "{\"latitude\": %.4f, \"longitude\": %.4f, \"datetime\": \"%s\", \"battery\": %d}",
        latitude, longitude, datetime, battery);

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();

    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:8080/upload");

        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);

        res = curl_easy_perform(curl);

        if(res != CURLE_OK)
            fprintf(stderr, "Request failed: %s\n", curl_easy_strerror(res));
        else
            printf("Data sent successfully\n");

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    curl_global_cleanup();
    return 0;
}

int main(){
    while(1){
        sensor_data();
        sleep(10);
    }
    return 0;
}